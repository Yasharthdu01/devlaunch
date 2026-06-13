const express = require('express')
const router = express.Router()
const pool = require('../db')
const { sendMail, ADMIN_EMAIL } = require('../utils/mailer')

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

    // Notify the business (best-effort, never blocks)
    sendMail({
      to: ADMIN_EMAIL,
      subject: `New enquiry — ${name || email || 'website visitor'}`,
      text:
        `New contact enquiry from the website.\n\n` +
        `Name: ${name || '—'}\nEmail: ${email || '—'}\nPhone: ${phone || '—'}\n` +
        `Company: ${company || '—'}\nIndustry: ${industry || '—'}\nBudget: ${budget || '—'}\n\n` +
        `Message:\n${message || '—'}\n`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
          <h2 style="color:#2563eb">New website enquiry</h2>
          <ul style="font-size:14px;line-height:1.8">
            <li><b>Name:</b> ${name || '—'}</li>
            <li><b>Email:</b> ${email || '—'}</li>
            <li><b>Phone:</b> ${phone || '—'}</li>
            <li><b>Company:</b> ${company || '—'}</li>
            <li><b>Industry:</b> ${industry || '—'}</li>
            <li><b>Budget:</b> ${budget || '—'}</li>
          </ul>
          <h3 style="margin-bottom:6px">Message</h3>
          <p style="font-size:14px;line-height:1.6;white-space:pre-line">${message || '—'}</p>
        </div>`,
    }).catch(() => {})

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