const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { sendMail, ADMIN_EMAIL } = require('../utils/mailer')

async function ensureSubmissionsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS onboarding_submissions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      project_id INTEGER,
      name VARCHAR(100),
      email VARCHAR(100),
      company VARCHAR(100),
      payload JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}
ensureSubmissionsTable().catch(err =>
  console.error('Could not ensure onboarding_submissions table:', err.message)
)

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

// Build a readable structured email body from the wizard form
function buildOnboardingEmail(user, form, projectId) {
  const asList = v => Array.isArray(v) ? (v.length ? v.join(', ') : '—') : (v || '—')

  const rows = [
    ['Client',        user.name],
    ['Email',         user.email],
    ['Company',       user.company_name || form.company],
    ['Project name',  form.title],
    ['Industry',      form.industry],
    ['Budget',        form.budget],
    ['Platforms',     asList(form.platforms)],
    ['Framework',     form.framework],
    ['Design style',  form.design_style],
    ['Screens',       form.screens],
    ['Responsive',    form.responsive],
    ['Backend',       form.backend],
    ['Database',      form.database],
    ['Integrations',  form.integrations],
    ['Marketing',     asList(form.marketing)],
    ['Cloud',         form.cloud],
    ['Timeline',      form.timeline],
    ['Support',       form.support],
    ['Project ID',    projectId || '—'],
  ]

  const text =
    `A user is onboarding via the AI wizard. Submitted requirements:\n\n` +
    rows.map(([k, v]) => `${k}: ${v || '—'}`).join('\n') +
    `\n\nDescription:\n${form.description || '—'}\n`

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
      <h2 style="color:#2563eb;margin-bottom:4px">New onboarding via AI wizard</h2>
      <p style="color:#555;margin-top:0">A user completed the wizard and submitted their project requirements.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="padding:6px 10px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;width:170px">${k}</td>
            <td style="padding:6px 10px;border:1px solid #e5e7eb">${(v ?? '—') || '—'}</td>
          </tr>`).join('')}
      </table>
      <h3 style="margin-top:20px;margin-bottom:6px">Description</h3>
      <p style="font-size:14px;line-height:1.6;white-space:pre-line">${form.description || '—'}</p>
    </div>`

  return { text, html }
}

// POST /api/wizard/submit - final wizard submission: save backup + notify admin
router.post('/submit', authMiddleware, async (req, res) => {
  const form = req.body || {}
  try {
    const userRes = await pool.query(
      'SELECT name, email, company_name FROM users WHERE id = $1',
      [req.user.id]
    )
    const user = userRes.rows[0] || { name: '', email: req.user.email, company_name: '' }

    await pool.query(
      `INSERT INTO onboarding_submissions (user_id, project_id, name, email, company, payload)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user.id,
        form.projectId || null,
        user.name,
        user.email,
        user.company_name || form.company || null,
        form,
      ]
    )

    const { text, html } = buildOnboardingEmail(user, form, form.projectId)
    // Best-effort — never blocks the response on email failure
    sendMail({
      to: ADMIN_EMAIL,
      subject: `New onboarding — ${user.name || user.email} (${form.title || 'project'})`,
      text,
      html,
    }).catch(() => {})

    res.json({ ok: true })
  } catch (err) {
    console.error('Wizard submit error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
