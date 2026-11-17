const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { sendMail, ADMIN_EMAIL } = require('../utils/mailer')
const { z } = require('zod')
const { requirePermission, isStaff } = require('../lib/rbac')
const { requireProjectAccess, toId } = require('../lib/access')
const { validateBody } = require('../lib/http')
const escapeHtml = require('../lib/escapeHtml')

const startSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  industry: z.string().trim().max(100).optional().nullable(),
  // Staff may open a project on behalf of one of their org's clients.
  client_id: z.coerce.number().int().positive().optional(),
})

const intOrNull = z.coerce.number().int().min(0).max(1e9).nullable().optional()
const stepSchema = z.object({
  requirements: z.any().optional(),
  budget_min: intOrNull,
  budget_max: intOrNull,
  timeline_weeks: z.coerce.number().int().min(0).max(520).nullable().optional(),
  platform: z.string().trim().max(100).nullable().optional(),
})

// POST /api/wizard/start - create new project in the caller's organization
router.post('/start', authMiddleware, requirePermission('projects:create'), validateBody(startSchema), async (req, res) => {
  const { title, description } = req.body
  let clientId = req.ctx.userId
  try {
    if (req.body.client_id && isStaff(req.ctx)) {
      const member = await pool.query(
        `SELECT 1 FROM memberships WHERE user_id = $1 AND org_id = $2 AND role = 'client'`,
        [req.body.client_id, req.ctx.orgId]
      )
      if (member.rows.length === 0) return res.status(400).json({ message: 'That client is not in your organization' })
      clientId = req.body.client_id
    }
    const result = await pool.query(
      `INSERT INTO projects (org_id, client_id, title, description, status)
       VALUES ($1, $2, $3, $4, 'discovery') RETURNING *`,
      [req.ctx.orgId, clientId, title, description || null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/wizard/:id - save step data (the project's client, or agency staff)
router.patch('/:id', authMiddleware, requireProjectAccess(req => req.params.id), validateBody(stepSchema), async (req, res) => {
  const { requirements, budget_min, budget_max, timeline_weeks, platform } = req.body
  try {
    const result = await pool.query(
      `UPDATE projects
       SET requirements = $1, budget_min = $2, budget_max = $3,
           timeline_weeks = $4, platform = $5
       WHERE id = $6 RETURNING *`,
      [requirements ?? null, budget_min ?? null, budget_max ?? null, timeline_weeks ?? null, platform ?? null, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// Build a readable structured email body from the wizard form
function buildOnboardingEmail(user, form, projectId) {
  const asList = v => Array.isArray(v) ? (v.length ? v.join(', ') : '—') : (v || '—')

  const rows = [
    ['Client',        user.name],
    ['Email',         user.email],
    ['Company',       user.company_name || form.company],
    ['Project name',  form.title],
    ['Industry',      form.industry],
    ['Budget',        form.budget],
    ['Platforms',     asList(form.platforms)],
    ['Framework',     form.framework],
    ['Design style',  form.design_style],
    ['Screens',       form.screens],
    ['Responsive',    form.responsive],
    ['Backend',       form.backend],
    ['Database',      form.database],
    ['Integrations',  form.integrations],
    ['Marketing',     asList(form.marketing)],
    ['Cloud',         form.cloud],
    ['Timeline',      form.timeline],
    ['Support',       form.support],
    ['Project ID',    projectId || '—'],
  ]

  const text =
    `A user is onboarding via the AI wizard. Submitted requirements:\n\n` +
    rows.map(([k, v]) => `${k}: ${v || '—'}`).join('\n') +
    `\n\nDescription:\n${form.description || '—'}\n`

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
      <h2 style="color:#2563eb;margin-bottom:4px">New onboarding via AI wizard</h2>
      <p style="color:#555;margin-top:0">A user completed the wizard and submitted their project requirements.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="padding:6px 10px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;width:170px">${escapeHtml(k)}</td>
            <td style="padding:6px 10px;border:1px solid #e5e7eb">${escapeHtml((v ?? '—') || '—')}</td>
          </tr>`).join('')}
      </table>
      <h3 style="margin-top:20px;margin-bottom:6px">Description</h3>
      <p style="font-size:14px;line-height:1.6;white-space:pre-line">${escapeHtml(form.description || '—')}</p>
    </div>`

  return { text, html }
}

// POST /api/wizard/submit - final wizard submission: save backup + notify admin
router.post('/submit', authMiddleware, async (req, res) => {
  const form = req.body || {}
  try {
    // A submission may only reference a project the caller can access.
    if (form.projectId) {
      const { userCanAccessProject } = require('../lib/access')
      if (!toId(form.projectId) || !(await userCanAccessProject(req.ctx, form.projectId))) {
        return res.status(404).json({ message: 'Project not found' })
      }
    }
    const userRes = await pool.query(
      'SELECT name, email, company_name FROM users WHERE id = $1',
      [req.user.id]
    )
    const user = userRes.rows[0] || { name: '', email: req.user.email, company_name: '' }

    await pool.query(
      `INSERT INTO onboarding_submissions (user_id, project_id, name, email, company, payload)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user.id,
        form.projectId || null,
        user.name,
        user.email,
        user.company_name || form.company || null,
        form,
      ]
    )

    const { text, html } = buildOnboardingEmail(user, form, form.projectId)
    // Notify this org's admins (never another agency's). Falls back to the
    // platform inbox only if the org has no admin email on file.
    const admins = await pool.query(
      `SELECT u.email FROM memberships m JOIN users u ON u.id = m.user_id
       WHERE m.org_id = $1 AND m.role = 'org_admin'`,
      [req.ctx.orgId]
    )
    const recipients = admins.rows.map(r => r.email).join(', ') || ADMIN_EMAIL
    // Best-effort — never blocks the response on email failure
    sendMail({
      to: recipients,
      subject: `New onboarding — ${user.name || user.email} (${form.title || 'project'})`,
      text,
      html,
    }).catch(() => {})

    res.json({ ok: true })
  } catch (err) {
    console.error('Wizard submit error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
