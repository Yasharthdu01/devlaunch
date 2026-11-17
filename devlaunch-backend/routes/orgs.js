// Organization (agency) management: members, roles, invitations, audit log.
// Every endpoint acts on the caller's *active* org (req.ctx.orgId).

const express = require('express')
const router = express.Router()
const { z } = require('zod')
const rateLimit = require('express-rate-limit')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { loadContext } = require('../middleware/auth')
const { requirePermission, ROLES } = require('../lib/rbac')
const { validateBody } = require('../lib/http')
const { recordAudit } = require('../lib/auditLog')
const { userPayload } = require('../lib/session')
const { sendMail } = require('../utils/mailer')
const escapeHtml = require('../lib/escapeHtml')
const { withTransaction, createOrganization, createInvitation, appUrl } = require('../lib/orgs')

const inviteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many invitations sent. Try again later.', code: 'RATE_LIMITED' },
})

const roleSchema = z.enum(ROLES)
const createOrgSchema = z.object({ name: z.string().trim().min(2).max(120) })
const inviteSchema = z.object({ email: z.string().trim().toLowerCase().email().max(100), role: roleSchema })
const changeRoleSchema = z.object({ role: roleSchema })

function needOrg(req, res, next) {
  if (!req.ctx.orgId) return res.status(400).json({ message: 'You are not part of an organization yet', code: 'NO_ORG' })
  next()
}

// The last org_admin can't be demoted or removed, or the org becomes unmanageable.
async function isLastAdmin(db, orgId, userId) {
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS admins,
            BOOL_OR(user_id = $2) AS target_is_admin
     FROM memberships WHERE org_id = $1 AND role = 'org_admin'`,
    [orgId, userId]
  )
  return rows[0].target_is_admin && rows[0].admins <= 1
}

// GET /api/orgs/current — active org, my role and permissions
router.get('/current', authMiddleware, (req, res) => {
  res.json(userPayload(req.ctx))
})

// POST /api/orgs — create a new agency; the caller becomes its org_admin
router.post('/', authMiddleware, inviteLimiter, validateBody(createOrgSchema), async (req, res) => {
  try {
    const owned = await pool.query(
      `SELECT COUNT(*)::int AS n FROM memberships WHERE user_id = $1 AND role = 'org_admin'`,
      [req.ctx.userId]
    )
    if (owned.rows[0].n >= 3 && !req.ctx.isSuperAdmin) {
      return res.status(400).json({ message: 'You can own at most 3 organizations' })
    }
    const org = await withTransaction(db => createOrganization(db, { name: req.body.name, userId: req.ctx.userId }))
    await recordAudit(req, 'org.created', { entityType: 'org', entityId: org.id, metadata: { name: org.name }, orgId: org.id })
    const ctx = await loadContext(req.ctx.userId, org.id)
    res.status(201).json({ org, user: userPayload(ctx) })
  } catch (err) {
    console.error('[orgs] create failed:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/orgs/current/members
router.get('/current/members', authMiddleware, needOrg, requirePermission('members:read'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.company_name, m.role, m.created_at AS joined_at
       FROM memberships m JOIN users u ON u.id = m.user_id
       WHERE m.org_id = $1
       ORDER BY CASE m.role WHEN 'org_admin' THEN 0 WHEN 'developer' THEN 1 ELSE 2 END, u.name`,
      [req.ctx.orgId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/orgs/current/members/:userId — change a member's role
router.patch(
  '/current/members/:userId',
  authMiddleware,
  needOrg,
  requirePermission('members:manage'),
  validateBody(changeRoleSchema),
  async (req, res) => {
    const userId = Number(req.params.userId)
    const { role } = req.body
    try {
      const current = await pool.query('SELECT role FROM memberships WHERE org_id = $1 AND user_id = $2', [
        req.ctx.orgId,
        userId,
      ])
      if (current.rows.length === 0) return res.status(404).json({ message: 'Member not found' })
      const from = current.rows[0].role
      if (from === role) return res.json({ user_id: userId, role })

      if (from === 'org_admin' && (await isLastAdmin(pool, req.ctx.orgId, userId))) {
        return res.status(400).json({ message: 'Promote another admin before changing the last admin’s role' })
      }
      await pool.query('UPDATE memberships SET role = $1 WHERE org_id = $2 AND user_id = $3', [role, req.ctx.orgId, userId])
      await recordAudit(req, 'member.role_changed', { entityType: 'user', entityId: userId, metadata: { from, to: role } })
      res.json({ user_id: userId, role })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// DELETE /api/orgs/current/members/:userId — remove someone from the org
router.delete('/current/members/:userId', authMiddleware, needOrg, requirePermission('members:manage'), async (req, res) => {
  const userId = Number(req.params.userId)
  try {
    const current = await pool.query('SELECT role FROM memberships WHERE org_id = $1 AND user_id = $2', [
      req.ctx.orgId,
      userId,
    ])
    if (current.rows.length === 0) return res.status(404).json({ message: 'Member not found' })
    if (current.rows[0].role === 'org_admin' && (await isLastAdmin(pool, req.ctx.orgId, userId))) {
      return res.status(400).json({ message: 'An organization needs at least one admin' })
    }
    await withTransaction(async db => {
      await db.query('DELETE FROM memberships WHERE org_id = $1 AND user_id = $2', [req.ctx.orgId, userId])
      // Unassign their work in this org so tasks don't point at an outsider.
      await db.query(
        `UPDATE tasks SET assignee_id = NULL
         WHERE assignee_id = $2 AND project_id IN (SELECT id FROM projects WHERE org_id = $1)`,
        [req.ctx.orgId, userId]
      )
      await db.query('UPDATE projects SET lead_id = NULL WHERE org_id = $1 AND lead_id = $2', [req.ctx.orgId, userId])
    })
    await recordAudit(req, 'member.removed', {
      entityType: 'user',
      entityId: userId,
      metadata: { role: current.rows[0].role },
    })
    res.json({ message: 'Removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/orgs/current/invitations — pending invitations
router.get('/current/invitations', authMiddleware, needOrg, requirePermission('members:manage'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT i.id, i.email, i.role, i.expires_at, i.created_at, u.name AS invited_by
       FROM invitations i LEFT JOIN users u ON u.id = i.invited_by
       WHERE i.org_id = $1 AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > NOW()
       ORDER BY i.created_at DESC`,
      [req.ctx.orgId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/orgs/current/invitations — invite by email. Returns a shareable
// link too, so the admin can send it over WhatsApp if email isn't set up.
router.post(
  '/current/invitations',
  authMiddleware,
  needOrg,
  requirePermission('members:manage'),
  inviteLimiter,
  validateBody(inviteSchema),
  async (req, res) => {
    const { email, role } = req.body
    try {
      const member = await pool.query(
        `SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
         WHERE m.org_id = $1 AND LOWER(u.email) = $2`,
        [req.ctx.orgId, email]
      )
      if (member.rows.length) return res.status(409).json({ message: 'That person is already a member' })

      const { invitation, token } = await withTransaction(db =>
        createInvitation(db, { orgId: req.ctx.orgId, email, role, invitedBy: req.ctx.userId })
      )
      const inviteUrl = `${appUrl()}/invite?token=${encodeURIComponent(token)}`
      const orgName = req.ctx.org.name
      const roleLabel = { org_admin: 'an admin', developer: 'a developer', client: 'a client' }[role]

      const mail = await sendMail({
        to: email,
        subject: `${orgName} invited you to DevLaunch`,
        text: `${req.ctx.name} invited you to join ${orgName} on DevLaunch as ${roleLabel}.\n\nAccept: ${inviteUrl}\n\nThis link expires in 7 days.`,
        html: `<div style="font-family:Arial,sans-serif;color:#111">
          <p>${escapeHtml(req.ctx.name)} invited you to join <b>${escapeHtml(orgName)}</b> on DevLaunch as ${roleLabel}.</p>
          <p><a href="${escapeHtml(inviteUrl)}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Accept invitation</a></p>
          <p style="color:#666;font-size:12px">This link expires in 7 days.</p></div>`,
      }).catch(() => ({ skipped: true }))

      await recordAudit(req, 'member.invited', {
        entityType: 'invitation',
        entityId: invitation.id,
        metadata: { email, role },
      })
      res.status(201).json({ invitation, invite_url: inviteUrl, email_sent: !mail?.skipped })
    } catch (err) {
      console.error('[orgs] invite failed:', err.message)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// DELETE /api/orgs/current/invitations/:id — revoke
router.delete('/current/invitations/:id', authMiddleware, needOrg, requirePermission('members:manage'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE invitations SET revoked_at = NOW()
       WHERE id = $1 AND org_id = $2 AND accepted_at IS NULL AND revoked_at IS NULL
       RETURNING id, email`,
      [req.params.id, req.ctx.orgId]
    )
    if (rows.length === 0) return res.status(404).json({ message: 'Invitation not found' })
    await recordAudit(req, 'member.invitation_revoked', {
      entityType: 'invitation',
      entityId: rows[0].id,
      metadata: { email: rows[0].email },
    })
    res.json({ message: 'Revoked' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/orgs/current/audit-log?before=<id>&limit=50 — newest first, keyset pagination
router.get('/current/audit-log', authMiddleware, needOrg, requirePermission('audit:read'), async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200)
  const before = parseInt(req.query.before) || null
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.action, a.entity_type, a.entity_id, a.metadata, a.created_at,
              u.name AS actor_name, u.email AS actor_email
       FROM audit_log a LEFT JOIN users u ON u.id = a.actor_id
       WHERE a.org_id = $1 AND ($2::bigint IS NULL OR a.id < $2)
       ORDER BY a.id DESC
       LIMIT $3`,
      [req.ctx.orgId, before, limit]
    )
    res.json({ entries: rows, next_before: rows.length === limit ? rows[rows.length - 1].id : null })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
