const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

// Admin only middleware
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

// GET /api/admin/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const clients  = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'client'`)
    const projects = await pool.query(`SELECT COUNT(*) FROM projects`)
    const active   = await pool.query(`SELECT COUNT(*) FROM projects WHERE status NOT IN ('live','delivered')`)
    const revenue  = await pool.query(`SELECT COALESCE(SUM(budget_min),0) as total FROM projects`)

    res.json({
      total_clients:   parseInt(clients.rows[0].count),
      total_projects:  parseInt(projects.rows[0].count),
      active_projects: parseInt(active.rows[0].count),
      total_revenue:   parseInt(revenue.rows[0].total),
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/clients
router.get('/clients', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.company_name, u.industry, u.created_at,
        COUNT(p.id) as project_count,
        COALESCE(SUM(p.budget_min), 0) as total_value
      FROM users u
      LEFT JOIN projects p ON p.client_id = u.id
      WHERE u.role = 'client'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/projects
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        u.name as client_name,
        u.company_name,
        u.email as client_email
      FROM projects p
      JOIN users u ON p.client_id = u.id
      ORDER BY p.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/admin/revenue
router.get('/revenue', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Mon YYYY') as month,
        COUNT(*) as project_count,
        COALESCE(SUM(budget_min), 0) as revenue
      FROM projects
      GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
      LIMIT 12
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// PATCH /api/admin/projects/:id
router.patch('/projects/:id', authMiddleware, async (req, res) => {
  const { status, developer } = req.body
  try {
    const result = await pool.query(
      `UPDATE projects SET 
        status = COALESCE($1, status),
        platform = COALESCE($2, platform)
       WHERE id = $3 RETURNING *`,
      [status, developer, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router