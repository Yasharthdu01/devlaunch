const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

async function ensureTicketsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      project_id INTEGER,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      type VARCHAR(50) DEFAULT 'bug',
      status VARCHAR(20) DEFAULT 'open',
      priority VARCHAR(20) DEFAULT 'medium',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)
}
ensureTicketsTable()

// GET /api/support
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/support
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, type, priority, project_id } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO support_tickets (user_id, project_id, title, description, type, priority)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, project_id || null, title, description, type || 'bug', priority || 'medium']
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/support/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body
  try {
    const result = await pool.query(
      `UPDATE support_tickets SET status = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, req.params.id, req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/support/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM support_tickets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router