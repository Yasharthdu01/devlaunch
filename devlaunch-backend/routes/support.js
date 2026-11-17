const express = require('express')
const router = express.Router()
const { z } = require('zod')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { requirePermission, can } = require('../lib/rbac')
const { userCanAccessProject } = require('../lib/access')
const { validateBody } = require('../lib/http')

const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed']

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).nullable().optional(),
  type: z.enum(['bug', 'feature', 'support', 'question', 'billing', 'other']).optional().default('bug'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  project_id: z.coerce.number().int().positive().nullable().optional(),
})
const updateSchema = z.object({ status: z.enum(TICKET_STATUSES) })

// Clients see their own tickets; agency staff see every ticket in the org.
function ticketScope(req, params) {
  params.push(req.ctx.orgId)
  let sql = 't.org_id = $' + params.length
  if (!can(req.ctx, 'tickets:read_all')) {
    params.push(req.ctx.userId)
    sql += ' AND t.user_id = $' + params.length
  }
  return sql
}

// GET /api/support
router.get('/', authMiddleware, async (req, res) => {
  if (!req.ctx.orgId) return res.json([])
  try {
    const params = []
    const result = await pool.query(
      `SELECT t.*, u.name AS raised_by
       FROM support_tickets t LEFT JOIN users u ON u.id = t.user_id
       WHERE ${ticketScope(req, params)}
       ORDER BY t.created_at DESC`,
      params
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/support
router.post('/', authMiddleware, requirePermission('tickets:create'), validateBody(createSchema), async (req, res) => {
  const { title, description, type, priority, project_id } = req.body
  try {
    if (project_id && !(await userCanAccessProject(req.ctx, project_id))) {
      return res.status(404).json({ message: 'Project not found' })
    }
    const result = await pool.query(
      `INSERT INTO support_tickets (org_id, user_id, project_id, title, description, type, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.ctx.orgId, req.ctx.userId, project_id || null, title, description ?? null, type, priority]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/support/:id — the ticket's author, or agency staff
router.patch('/:id', authMiddleware, validateBody(updateSchema), async (req, res) => {
  try {
    const params = [req.body.status, req.params.id]
    const result = await pool.query(
      `UPDATE support_tickets t SET status = $1, updated_at = NOW()
       WHERE t.id = $2 AND ${ticketScope(req, params)} RETURNING t.*`,
      params
    )
    if (result.rows.length === 0) return res.status(404).json({ message: 'Ticket not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/support/:id — the ticket's author, or staff who manage tickets
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const params = [req.params.id]
    const result = await pool.query(
      `DELETE FROM support_tickets t WHERE t.id = $1 AND ${ticketScope(req, params)} RETURNING t.id`,
      params
    )
    if (result.rows.length === 0) return res.status(404).json({ message: 'Ticket not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
