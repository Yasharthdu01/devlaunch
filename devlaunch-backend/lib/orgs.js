// Organization + invitation helpers shared by auth and org routes.
const crypto = require('crypto')
const pool = require('../db')

const DEFAULT_ORG_SLUG = 'devlaunch'
const INVITE_TTL_DAYS = 7

async function withTransaction(fn) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
  }
}

function slugify(name) {
  return (
    String(name)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'agency'
  )
}

// Create an org and make `userId` its org_admin. Runs inside `db` (a transaction client).
async function createOrganization(db, { name, userId }) {
  const base = slugify(name)
  let slug = base
  for (let attempt = 0; attempt < 5; attempt++) {
    const taken = await db.query('SELECT 1 FROM organizations WHERE slug = $1', [slug])
    if (taken.rows.length === 0) break
    slug = `${base}-${crypto.randomBytes(2).toString('hex')}`
  }
  const org = await db.query(
    'INSERT INTO organizations (name, slug, created_by) VALUES ($1, $2, $3) RETURNING id, name, slug, status',
    [name, slug, userId]
  )
  await db.query(`INSERT INTO memberships (user_id, org_id, role) VALUES ($1, $2, 'org_admin')`, [userId, org.rows[0].id])
  return org.rows[0]
}

async function defaultOrgId(db = pool) {
  const { rows } = await db.query('SELECT id FROM organizations WHERE slug = $1', [DEFAULT_ORG_SLUG])
  if (rows.length === 0) throw new Error('Default organization is missing; run migrations')
  return rows[0].id
}

const hashToken = token => crypto.createHash('sha256').update(token).digest('hex')

// Returns { invitation, token }. The raw token is only ever returned here.
async function createInvitation(db, { orgId, email, role, invitedBy }) {
  const token = crypto.randomBytes(32).toString('base64url')
  // One live invite per email per org: re-inviting replaces the old link.
  await db.query(
    `UPDATE invitations SET revoked_at = NOW()
     WHERE org_id = $1 AND LOWER(email) = LOWER($2) AND accepted_at IS NULL AND revoked_at IS NULL`,
    [orgId, email]
  )
  const { rows } = await db.query(
    `INSERT INTO invitations (org_id, email, role, token_hash, invited_by, expires_at)
     VALUES ($1, LOWER($2), $3, $4, $5, NOW() + ($6 || ' days')::interval)
     RETURNING id, org_id, email, role, expires_at, created_at`,
    [orgId, email, role, hashToken(token), invitedBy, String(INVITE_TTL_DAYS)]
  )
  return { invitation: rows[0], token }
}

// A usable invitation for this token, or null.
async function findPendingInvitation(db, token) {
  if (!token || typeof token !== 'string' || token.length > 200) return null
  const { rows } = await db.query(
    `SELECT i.id, i.org_id, i.email, i.role, i.expires_at, o.name AS org_name, o.status AS org_status
     FROM invitations i JOIN organizations o ON o.id = i.org_id
     WHERE i.token_hash = $1 AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > NOW()`,
    [hashToken(token)]
  )
  const invite = rows[0]
  if (!invite || invite.org_status !== 'active') return null
  return invite
}

async function acceptInvitation(db, invite, userId) {
  await db.query(
    `INSERT INTO memberships (user_id, org_id, role) VALUES ($1, $2, $3)
     ON CONFLICT (user_id, org_id) DO UPDATE SET role = EXCLUDED.role`,
    [userId, invite.org_id, invite.role]
  )
  await db.query('UPDATE invitations SET accepted_at = NOW() WHERE id = $1', [invite.id])
}

function appUrl() {
  return (process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '')
}

module.exports = {
  DEFAULT_ORG_SLUG,
  withTransaction,
  createOrganization,
  defaultOrgId,
  createInvitation,
  findPendingInvitation,
  acceptInvitation,
  hashToken,
  slugify,
  appUrl,
}
