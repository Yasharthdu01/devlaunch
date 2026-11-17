// Authentication + tenant context.
//
// 1. Verifies the JWT (identity only: the token is never trusted for roles,
//    so a role change or removal takes effect on the very next request).
// 2. Loads the user's memberships from the database and picks the active
//    organization: the X-Org-Id header if the user belongs to it, otherwise
//    their highest-privilege membership.
// 3. Exposes req.ctx = { userId, isSuperAdmin, orgId, orgRole, org, memberships }.
//    req.user is kept for older code paths: { id, email, name, role }.

const jwt = require('jsonwebtoken')
const pool = require('../db')
require('dotenv').config()

const ROLE_PRIORITY = { org_admin: 0, developer: 1, client: 2 }

// Legacy single-string role, kept for the frontend and older code paths.
function legacyRole(ctx) {
  if (ctx.isSuperAdmin || ctx.orgRole === 'org_admin') return 'admin'
  return ctx.orgRole || 'none'
}

async function loadContext(userId, requestedOrgId) {
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email, u.is_super_admin, u.company_name, u.industry,
            m.org_id, m.role AS org_role, o.name AS org_name, o.slug AS org_slug, o.status AS org_status
     FROM users u
     LEFT JOIN memberships m ON m.user_id = u.id
     LEFT JOIN organizations o ON o.id = m.org_id
     WHERE u.id = $1`,
    [userId]
  )
  if (rows.length === 0) return null

  const user = rows[0]
  const memberships = rows
    .filter(r => r.org_id)
    .map(r => ({
      orgId: r.org_id,
      role: r.org_role,
      org: { id: r.org_id, name: r.org_name, slug: r.org_slug, status: r.org_status },
    }))
    .sort((a, b) => ROLE_PRIORITY[a.role] - ROLE_PRIORITY[b.role] || a.orgId - b.orgId)

  const ctx = {
    userId: user.id,
    email: user.email,
    name: user.name,
    companyName: user.company_name,
    industry: user.industry,
    isSuperAdmin: Boolean(user.is_super_admin),
    memberships,
    orgId: null,
    orgRole: null,
    org: null,
  }

  const wanted = Number(requestedOrgId)
  let active = Number.isInteger(wanted) && wanted > 0 ? memberships.find(m => m.orgId === wanted) : null

  // Super admins may enter any org (support access), even without a membership.
  if (!active && ctx.isSuperAdmin && Number.isInteger(wanted) && wanted > 0) {
    const org = await pool.query('SELECT id, name, slug, status FROM organizations WHERE id = $1', [wanted])
    if (org.rows.length) active = { orgId: wanted, role: null, org: org.rows[0] }
  }
  if (!active) active = memberships.find(m => m.org.status === 'active') || memberships[0] || null

  if (active) {
    ctx.orgId = active.orgId
    ctx.orgRole = active.role
    ctx.org = active.org
  }
  return ctx
}

async function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'No token, access denied' })

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const ctx = await loadContext(decoded.id, req.header('X-Org-Id'))
    if (!ctx) return res.status(401).json({ message: 'Account not found' })

    if (ctx.org && ctx.org.status !== 'active' && !ctx.isSuperAdmin) {
      return res.status(403).json({ message: 'This organization is suspended. Contact support.', code: 'ORG_SUSPENDED' })
    }

    req.ctx = ctx
    req.user = { id: ctx.userId, email: ctx.email, name: ctx.name, role: legacyRole(ctx) }
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = authMiddleware
module.exports.loadContext = loadContext
module.exports.legacyRole = legacyRole
