const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { requirePermission } = require('../lib/rbac')
const { requireProjectAccess, projectScope } = require('../lib/access')
const { recordAudit } = require('../lib/auditLog')

const PROJECT_STATUSES = ['discovery', 'design', 'development', 'testing', 'deploy', 'live']

// GET /api/projects — staff see every project in the org, clients see their own
router.get('/', authMiddleware, async (req, res) => {
  if (!req.ctx.orgId) return res.json([])
  try {
    const params = []
    const where = projectScope(req.ctx, params)
    const result = await pool.query(
      `SELECT p.*, u.name AS client_name, u.email AS client_email, u.company_name
       FROM projects p
       LEFT JOIN users u ON u.id = p.client_id
       WHERE ${where}
       ORDER BY p.created_at DESC`,
      params
    )
    res.json(result.rows)
  } catch (err) {
    console.error('[projects] list failed:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/projects/:id
router.get('/:id', authMiddleware, requireProjectAccess(req => req.params.id), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS client_name, u.email AS client_email, u.company_name
       FROM projects p LEFT JOIN users u ON u.id = p.client_id
       WHERE p.id = $1`,
      [req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/projects/:id/status — agency staff move a project through delivery stages
router.patch(
  '/:id/status',
  authMiddleware,
  requirePermission('projects:update'),
  requireProjectAccess(req => req.params.id),
  async (req, res) => {
    const { status } = req.body || {}
    if (!PROJECT_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status', allowed: PROJECT_STATUSES })
    }
    try {
      const before = await pool.query('SELECT status FROM projects WHERE id = $1', [req.params.id])
      const result = await pool.query('UPDATE projects SET status = $1 WHERE id = $2 RETURNING *', [
        status,
        req.params.id,
      ])
      await recordAudit(req, 'project.status_changed', {
        entityType: 'project',
        entityId: req.params.id,
        metadata: { from: before.rows[0]?.status, to: status },
      })
      res.json(result.rows[0])
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
    }
  }
)

module.exports = router
module.exports.PROJECT_STATUSES = PROJECT_STATUSES
