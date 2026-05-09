const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

// Create milestones table first
async function ensureMilestonesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS milestones (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id),
      title VARCHAR(200) NOT NULL,
      due_date DATE,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}
ensureMilestonesTable()

// GET /api/milestones/:project_id
router.get('/:project_id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM milestones WHERE project_id = $1 ORDER BY due_date ASC',
      [req.params.project_id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/milestones — create milestone
router.post('/', authMiddleware, async (req, res) => {
  const { project_id, title, due_date } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO milestones (project_id, title, due_date) VALUES ($1, $2, $3) RETURNING *',
      [project_id, title, due_date]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/milestones/:id — update milestone status
router.patch('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body
  try {
    const result = await pool.query(
      'UPDATE milestones SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/milestones/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM milestones WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router