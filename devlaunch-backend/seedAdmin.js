const bcrypt = require('bcryptjs')
const pool = require('./db')
require('dotenv').config()

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'webandagent@devlaunch.in'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Web123'

async function seedAdmin() {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, salt)

    // Ensure the unique constraint on email exists (it does in createTables),
    // then upsert the admin account.
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, company_name)
       VALUES ($1, $2, $3, 'admin', 'DevLaunch')
       ON CONFLICT (email)
       DO UPDATE SET password = EXCLUDED.password, role = 'admin', name = EXCLUDED.name
       RETURNING id, name, email, role`,
      ['DevLaunch Admin', ADMIN_EMAIL, hashed]
    )

    console.log('✅ Admin account ready:', result.rows[0])
    console.log(`   Login with: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to seed admin:', err.message)
    process.exit(1)
  }
}

seedAdmin()
