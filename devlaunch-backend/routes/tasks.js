const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

async function ensureTasksTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id),
      title VARCHAR(200) NOT NULL,
      description TEXT,
      status VARCHAR(20) DEFAULT 'todo',
      assigned_to VARCHAR(100),
      type VARCHAR(50) DEFAULT 'feature',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}
ensureTasksTable()

// GET /api/tasks/:project_id
router.get('/:project_id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC',
      [req.params.project_id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/tasks
router.post('/', authMiddleware, async (req, res) => {
  const { project_id, title, description, assigned_to, type } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description, assigned_to, type)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_id, title, description, assigned_to, type || 'feature']
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/tasks/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  const { status, title, assigned_to } = req.body
  try {
    const result = await pool.query(
      `UPDATE tasks SET 
        status = COALESCE($1, status),
        title = COALESCE($2, title),
        assigned_to = COALESCE($3, assigned_to)
       WHERE id = $4 RETURNING *`,
      [status, title, assigned_to, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/tasks/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/tasks/:id/comments
router.get('/:id/comments', authMiddleware, async (req, res) => {
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

// POST /api/tasks/:id/comments
router.post('/:id/comments', authMiddleware, async (req, res) => {
  const { content } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO comments (task_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.id, req.user.id, content]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router