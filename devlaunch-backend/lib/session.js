// Shapes the "current user" object the frontend stores after login and /me.
const jwt = require('jsonwebtoken')
const { legacyRole } = require('../middleware/auth')
const { permissionsFor } = require('./rbac')

// The token carries identity only. Roles and orgs are read from the database
// on every request, so revoking access never waits for a token to expire.
function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function userPayload(ctx) {
  return {
    id: ctx.userId,
    name: ctx.name,
    email: ctx.email,
    company_name: ctx.companyName ?? null,
    industry: ctx.industry ?? null,
    role: legacyRole(ctx), // 'admin' | 'developer' | 'client' | 'none' (kept for older UI code)
    org_role: ctx.orgRole,
    is_super_admin: ctx.isSuperAdmin,
    org: ctx.org ? { id: ctx.org.id, name: ctx.org.name, slug: ctx.org.slug, status: ctx.org.status } : null,
    orgs: ctx.memberships.map(m => ({ id: m.orgId, name: m.org.name, slug: m.org.slug, role: m.role })),
    permissions: permissionsFor(ctx),
  }
}

module.exports = { signToken, userPayload }
