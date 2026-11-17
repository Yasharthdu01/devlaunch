// Platform operator (super admin) endpoints: every organization on DevLaunch.
const express = require('express')
const router = express.Router()
const { z } = require('zod')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { requirePermission } = require('../lib/rbac')
const { validateBody } = require('../lib/http')
const { recordAudit } = require('../lib/auditLog')
const { DEFAULT_ORG_SLUG } = require('../lib/orgs')

const superAdmin = [authMiddleware, requirePermission('platform:orgs')]

// GET /api/platform/stats
router.get('/stats', ...superAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM organizations)::int AS organizations,
        (SELECT COUNT(*) FROM organizations WHERE status = 'suspended')::int AS suspended,
        (SELECT COUNT(*) FROM users)::int AS users,
        (SELECT COUNT(*) FROM projects)::int AS projects,
        (SELECT COUNT(*) FROM organizations WHERE created_at > NOW() - INTERVAL '30 days')::int AS new_orgs_30d`)
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/platform/orgs
router.get('/orgs', ...superAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT o.id, o.name, o.slug, o.status, o.created_at,
             owner.name AS owner_name, owner.email AS owner_email,
             (SELECT COUNT(*) FROM memberships m WHERE m.org_id = o.id)::int AS members,
             (SELECT COUNT(*) FROM memberships m WHERE m.org_id = o.id AND m.role = 'client')::int AS clients,
             (SELECT COUNT(*) FROM projects p WHERE p.org_id = o.id)::int AS projects
      FROM organizations o
      LEFT JOIN users owner ON owner.id = o.created_by
      ORDER BY o.created_at DESC`)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/platform/orgs/:id — suspend or reactivate an organization
router.patch('/orgs/:id', ...superAdmin, validateBody(z.object({ status: z.enum(['active', 'suspended']) })), async (req, res) => {
  try {
    const org = await pool.query('SELECT id, slug, status FROM organizations WHERE id = $1', [req.params.id])
    if (org.rows.length === 0) return res.status(404).json({ message: 'Organization not found' })
    if (org.rows[0].slug === DEFAULT_ORG_SLUG && req.body.status === 'suspended') {
      return res.status(400).json({ message: 'The platform’s own organization cannot be suspended' })
    }
    const { rows } = await pool.query('UPDATE organizations SET status = $1 WHERE id = $2 RETURNING id, name, status', [
      req.body.status,
      req.params.id,
    ])
    await recordAudit(req, req.body.status === 'suspended' ? 'org.suspended' : 'org.reactivated', {
      entityType: 'org',
      entityId: req.params.id,
      metadata: { from: org.rows[0].status },
      orgId: Number(req.params.id),
    })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
