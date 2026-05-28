const express = require('express')
const router = express.Router()
const pool = require('../db')

async function ensureEnquiryTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      phone VARCHAR(20),
      company VARCHAR(100),
      industry VARCHAR(100),
      budget VARCHAR(50),
      message TEXT,
      status VARCHAR(20) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}
ensureEnquiryTable()

router.post('/', async (req, res) => {
  const { name, email, phone, company, industry, budget, message } = req.body
  try {
    await pool.query(
      `INSERT INTO enquiries (name, email, phone, company, industry, budget, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, email, phone, company, industry, budget, message]
    )
    res.status(201).json({ message: 'Enquiry received' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM enquiries ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router