// Creates or resets the platform super admin.
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password' npm run seed:admin
// Never ships with a default password: the old default was public in this repo.
const bcrypt = require('bcryptjs')
require('dotenv').config()
const pool = require('./db')
const { defaultOrgId } = require('./lib/orgs')

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.ADMIN_NOTIFY_EMAIL || '').trim().toLowerCase()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

async function seedAdmin() {
  if (!ADMIN_EMAIL || ADMIN_PASSWORD.length < 12) {
    console.error('❌ Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters).')
    process.exit(1)
  }
  try {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10)
    const user = await pool.query(
      `INSERT INTO users (name, email, password, role, company_name, is_super_admin)
       VALUES ($1, $2, $3, 'admin', 'DevLaunch', TRUE)
       ON CONFLICT (email)
       DO UPDATE SET password = EXCLUDED.password, is_super_admin = TRUE
       RETURNING id, name, email`,
      ['DevLaunch Admin', ADMIN_EMAIL, hashed]
    )
    const orgId = await defaultOrgId()
    await pool.query(
      `INSERT INTO memberships (user_id, org_id, role) VALUES ($1, $2, 'org_admin')
       ON CONFLICT (user_id, org_id) DO UPDATE SET role = 'org_admin'`,
      [user.rows[0].id, orgId]
    )
    console.log('✅ Super admin ready:', user.rows[0].email)
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to seed admin:', err.message)
    process.exit(1)
  }
}

seedAdmin()
