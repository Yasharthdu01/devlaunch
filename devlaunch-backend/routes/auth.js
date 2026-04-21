const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
require('dotenv').config()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, company_name, industry } = req.body

  try {
    // Check if user already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, company_name, industry)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
      [name, email, hashedPassword, company_name, industry]
    )

    const user = result.rows[0]

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user })

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const user = result.rows[0]

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company_name: user.company_name,
      }
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/me  (protected)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, company_name, industry FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router