const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

// GET /api/projects — get all projects for logged in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/projects/:id — get single project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND client_id = $2',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/projects/:id/status — update project status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body
  const validStatuses = ['discovery', 'design', 'development', 'testing', 'deploy', 'live']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  try {
    const result = await pool.query(
      'UPDATE projects SET status = $1 WHERE id = $2 AND client_id = $3 RETURNING *',
      [status, req.params.id, req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router