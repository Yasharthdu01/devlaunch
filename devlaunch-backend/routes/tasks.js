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
const byTask = requireChildAccess('tasks', req => req.params.id)

const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done']
const TASK_TYPES = ['feature', 'bug', 'design', 'devops', 'research', 'other']

const createSchema = z.object({
  project_id: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).nullable().optional(),
  assigned_to: z.string().trim().max(100).nullable().optional(),
  assignee_id: z.coerce.number().int().positive().nullable().optional(),
  type: z.enum(TASK_TYPES).optional().default('feature'),
})

const updateSchema = z
  .object({
    status: z.enum(TASK_STATUSES).optional(),
    title: z.string().trim().min(1).max(200).optional(),
    assigned_to: z.string().trim().max(100).nullable().optional(),
    assignee_id: z.coerce.number().int().positive().nullable().optional(),
  })
  .refine(v => Object.keys(v).length > 0, { message: 'Nothing to update' })

const commentSchema = z.object({ content: z.string().trim().min(1).max(4000) })

// Tasks can only be assigned to agency staff in the same org.
async function resolveAssignee(orgId, assigneeId) {
  if (assigneeId === undefined) return { ok: true, value: undefined }
  if (assigneeId === null) return { ok: true, value: null, name: null }
  const { rows } = await pool.query(
    `SELECT u.id, u.name FROM memberships m JOIN users u ON u.id = m.user_id
     WHERE m.org_id = $1 AND m.user_id = $2 AND m.role IN ('org_admin', 'developer')`,
    [orgId, assigneeId]
  )
  if (rows.length === 0) return { ok: false }
  return { ok: true, value: rows[0].id, name: rows[0].name }
}

const TASK_SELECT = `
  SELECT t.*, a.name AS assignee_name
  FROM tasks t LEFT JOIN users a ON a.id = t.assignee_id`

// GET /api/tasks/mine — tasks assigned to me across my org's projects
router.get('/mine', authMiddleware, requirePermission('tasks:manage'), async (req, res) => {
  try {
    const result = await pool.query(
      `${TASK_SELECT}
       JOIN projects p ON p.id = t.project_id
       WHERE t.assignee_id = $1 AND p.org_id = $2
       ORDER BY t.status = 'done', t.created_at ASC`,
      [req.ctx.userId, req.ctx.orgId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/tasks/:project_id
router.get('/:project_id', authMiddleware, requirePermission('tasks:read'), byProjectParam, async (req, res) => {
  try {
    const result = await pool.query(`${TASK_SELECT} WHERE t.project_id = $1 ORDER BY t.created_at ASC`, [
      req.params.project_id,
    ])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/tasks — agency staff only; clients see tasks and comment
router.post('/', authMiddleware, requirePermission('tasks:manage'), validateBody(createSchema), byProjectBody, async (req, res) => {
  const { project_id, title, description, type } = req.body
  try {
    const assignee = await resolveAssignee(req.ctx.orgId, req.body.assignee_id)
    if (!assignee.ok) return res.status(400).json({ message: 'Tasks can only be assigned to your team members' })
    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description, assigned_to, assignee_id, type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [project_id, title, description ?? null, assignee.name ?? req.body.assigned_to ?? null, assignee.value ?? null, type]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/tasks/:id
router.patch('/:id', authMiddleware, requirePermission('tasks:manage'), validateBody(updateSchema), byTask, async (req, res) => {
  const { status, title } = req.body
  try {
    const assignee = await resolveAssignee(req.ctx.orgId, req.body.assignee_id)
    if (!assignee.ok) return res.status(400).json({ message: 'Tasks can only be assigned to your team members' })

    const sets = []
    const params = []
    const set = (col, val) => {
      params.push(val)
      sets.push(`${col} = $${params.length}`)
    }
    if (status !== undefined) set('status', status)
    if (title !== undefined) set('title', title)
    if (assignee.value !== undefined) {
      set('assignee_id', assignee.value)
      set('assigned_to', assignee.name)
    } else if (req.body.assigned_to !== undefined) {
      set('assigned_to', req.body.assigned_to)
    }
    params.push(req.params.id)
    const result = await pool.query(`UPDATE tasks SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`, params)
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/tasks/:id
router.delete('/:id', authMiddleware, requirePermission('tasks:manage'), byTask, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING title', [req.params.id])
    await recordAudit(req, 'task.deleted', {
      entityType: 'task',
      entityId: req.params.id,
      metadata: { title: result.rows[0]?.title, project_id: req.projectId },
    })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/tasks/:id/comments
router.get('/:id/comments', authMiddleware, requirePermission('tasks:read'), byTask, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.task_id = $1 ORDER BY c.created_at ASC`,
      [req.params.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/tasks/:id/comments — clients and staff
router.post('/:id/comments', authMiddleware, requirePermission('tasks:comment'), validateBody(commentSchema), byTask, async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO comments (task_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.id, req.ctx.userId, req.body.content]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
