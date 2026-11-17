// Agency dashboard: everything is scoped to the caller's organization.
// Marketing leads captured by the public DevLaunch site (enquiries, website
// audits, WhatsApp demo) belong to the platform, so only super admins see them.

const express = require('express')
const router = express.Router()
const { z } = require('zod')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { requirePermission, can } = require('../lib/rbac')
const { validateBody } = require('../lib/http')
const { recordAudit } = require('../lib/auditLog')
const { PROJECT_STATUSES } = require('./projects')

const orgAdmin = [authMiddleware, requirePermission('stats:read')]

// GET /api/admin/stats
router.get('/stats', ...orgAdmin, async (req, res) => {
  const org = req.ctx.orgId
  try {
    const [clients, projects, active, revenue] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM memberships WHERE org_id = $1 AND role = 'client'`, [org]),
      pool.query(`SELECT COUNT(*) FROM projects WHERE org_id = $1`, [org]),
      pool.query(`SELECT COUNT(*) FROM projects WHERE org_id = $1 AND status NOT IN ('live', 'delivered')`, [org]),
      pool.query(`SELECT COALESCE(SUM(budget_min), 0) AS total FROM projects WHERE org_id = $1`, [org]),
    ])
    res.json({
      total_clients: parseInt(clients.rows[0].count),
      total_projects: parseInt(projects.rows[0].count),
      active_projects: parseInt(active.rows[0].count),
      total_revenue: parseInt(revenue.rows[0].total),
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/clients
router.get('/clients', ...orgAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.company_name, u.industry, u.created_at,
              COUNT(p.id) AS project_count,
              COALESCE(SUM(p.budget_min), 0) AS total_value
       FROM memberships m
       JOIN users u ON u.id = m.user_id
       LEFT JOIN projects p ON p.client_id = u.id AND p.org_id = m.org_id
       WHERE m.org_id = $1 AND m.role = 'client'
       GROUP BY u.id
       ORDER BY u.created_at DESC`,
      [req.ctx.orgId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/projects
router.get('/projects', ...orgAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS client_name, u.company_name, u.email AS client_email, l.name AS lead_name
       FROM projects p
       LEFT JOIN users u ON u.id = p.client_id
       LEFT JOIN users l ON l.id = p.lead_id
       WHERE p.org_id = $1
       ORDER BY p.created_at DESC`,
      [req.ctx.orgId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/revenue
router.get('/revenue', ...orgAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT TO_CHAR(created_at, 'Mon YYYY') AS month,
              COUNT(*) AS project_count,
              COALESCE(SUM(budget_min), 0) AS revenue
       FROM projects
       WHERE org_id = $1
       GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
       ORDER BY DATE_TRUNC('month', created_at) ASC
       LIMIT 12`,
      [req.ctx.orgId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/submissions — wizard submissions for this org's projects
router.get('/submissions', ...orgAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.user_id, s.project_id, s.name, s.email, s.company, s.payload, s.created_at
       FROM onboarding_submissions s
       JOIN projects p ON p.id = s.project_id
       WHERE p.org_id = $1
       ORDER BY s.created_at DESC
       LIMIT 200`,
      [req.ctx.orgId]
    )
    res.json(result.rows)
  } catch (err) {
    res.json([])
  }
})

// Platform-level lead lists (public site forms). Super admins only; others get [].
function platformLeads(sql) {
  return [
    authMiddleware,
    async (req, res) => {
      if (!can(req.ctx, 'platform:stats')) return res.json([])
      try {
        const result = await pool.query(sql)
        res.json(result.rows)
      } catch (err) {
        res.json([])
      }
    },
  ]
}

router.get(
  '/enquiries',
  ...platformLeads(`SELECT id, name, email, phone, company, industry, budget, message, status, created_at
                    FROM enquiries ORDER BY created_at DESC LIMIT 200`)
)
router.get(
  '/audits',
  ...platformLeads(`SELECT id, url, name, email, phone, score, created_at
                    FROM audits ORDER BY created_at DESC LIMIT 200`)
)
router.get(
  '/whatsapp-leads',
  ...platformLeads(`SELECT id, business, name, phone, industry, plan, created_at
                    FROM whatsapp_leads ORDER BY created_at DESC LIMIT 200`)
)

const updateProjectSchema = z
  .object({
    status: z.enum(PROJECT_STATUSES).optional(),
    lead_id: z.coerce.number().int().positive().nullable().optional(),
  })
  .refine(v => v.status !== undefined || v.lead_id !== undefined, { message: 'Nothing to update' })

// PATCH /api/admin/projects/:id — change status / assign the lead developer
router.patch('/projects/:id', ...orgAdmin, requirePermission('projects:update'), validateBody(updateProjectSchema), async (req, res) => {
  const { status, lead_id } = req.body
  try {
    if (lead_id) {
      const staff = await pool.query(
        `SELECT 1 FROM memberships WHERE org_id = $1 AND user_id = $2 AND role IN ('org_admin', 'developer')`,
        [req.ctx.orgId, lead_id]
      )
      if (staff.rows.length === 0) return res.status(400).json({ message: 'Lead must be a member of your team' })
    }
    const result = await pool.query(
      `UPDATE projects SET
         status = COALESCE($1, status),
         lead_id = CASE WHEN $2::boolean THEN $3::int ELSE lead_id END
       WHERE id = $4 AND org_id = $5
       RETURNING *`,
      [status ?? null, lead_id !== undefined, lead_id ?? null, req.params.id, req.ctx.orgId]
    )
    if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' })
    await recordAudit(req, 'project.updated', {
      entityType: 'project',
      entityId: req.params.id,
      metadata: { status, lead_id },
    })
    const lead = result.rows[0].lead_id
      ? await pool.query('SELECT name FROM users WHERE id = $1', [result.rows[0].lead_id])
      : null
    res.json({ ...result.rows[0], lead_name: lead?.rows[0]?.name ?? null })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
