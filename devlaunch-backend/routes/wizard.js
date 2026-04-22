const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

// POST /api/wizard/start - create new project
router.post('/start', authMiddleware, async (req, res) => {
  const { title, description, industry } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO projects (client_id, title, description, status)
       VALUES ($1, $2, $3, 'discovery') RETURNING *`,
      [req.user.id, title, description]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/wizard/:id - save step data
router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { requirements, budget_min, budget_max, timeline_weeks, platform } = req.body
  try {
    const result = await pool.query(
      `UPDATE projects 
       SET requirements = $1, budget_min = $2, budget_max = $3, 
           timeline_weeks = $4, platform = $5
       WHERE id = $6 AND client_id = $7 RETURNING *`,
      [requirements, budget_min, budget_max, timeline_weeks, platform, id, req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router