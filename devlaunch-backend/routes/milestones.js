const express = require('express')
const router = express.Router()
const { z } = require('zod')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { requirePermission } = require('../lib/rbac')
const { requireProjectAccess, requireChildAccess } = require('../lib/access')
const { validateBody } = require('../lib/http')
const { recordAudit } = require('../lib/auditLog')

const byProjectParam = requireProjectAccess(req => req.params.project_id)
const byProjectBody = requireProjectAccess(req => req.body?.project_id)
const byMilestone = requireChildAccess('milestones', req => req.params.id)

const MILESTONE_STATUSES = ['pending', 'in_progress', 'done']

const createSchema = z.object({
  project_id: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).max(200),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
    .nullable()
    .optional(),
})
const updateSchema = z.object({ status: z.enum(MILESTONE_STATUSES) })

// GET /api/milestones/:project_id
router.get('/:project_id', authMiddleware, requirePermission('milestones:read'), byProjectParam, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM milestones WHERE project_id = $1 ORDER BY due_date ASC', [
      req.params.project_id,
    ])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/milestones — org admins plan milestones
router.post('/', authMiddleware, requirePermission('milestones:manage'), validateBody(createSchema), byProjectBody, async (req, res) => {
  const { project_id, title, due_date } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO milestones (project_id, title, due_date) VALUES ($1, $2, $3) RETURNING *',
      [project_id, title, due_date ?? null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/milestones/:id — update milestone status
router.patch('/:id', authMiddleware, requirePermission('milestones:manage'), validateBody(updateSchema), byMilestone, async (req, res) => {
  try {
    const result = await pool.query('UPDATE milestones SET status = $1 WHERE id = $2 RETURNING *', [
      req.body.status,
      req.params.id,
    ])
    await recordAudit(req, 'milestone.status_changed', {
      entityType: 'milestone',
      entityId: req.params.id,
      metadata: { to: req.body.status, project_id: req.projectId },
    })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/milestones/:id
router.delete('/:id', authMiddleware, requirePermission('milestones:manage'), byMilestone, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM milestones WHERE id = $1 RETURNING title', [req.params.id])
    await recordAudit(req, 'milestone.deleted', {
      entityType: 'milestone',
      entityId: req.params.id,
      metadata: { title: result.rows[0]?.title, project_id: req.projectId },
    })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
