// Role-based access control.
//
// Two layers:
//   1. Platform: users.is_super_admin (the DevLaunch operator). Manages orgs.
//   2. Organization: memberships.role in the active org.
//        org_admin  - agency owner/manager: everything inside their org
//        developer  - agency team member: works on projects, can't manage people or money
//        client     - the agency's customer: only their own projects
//
// Routes ask for a permission, never a role, so changing what a role can do is
// a one-line change here instead of a hunt through every route.

const ROLES = ['org_admin', 'developer', 'client']

const ROLE_PERMISSIONS = {
  org_admin: [
    'org:read',
    'members:read',
    'members:manage',
    'audit:read',
    'stats:read',
    'projects:create',
    'projects:read_all',
    'projects:update',
    'proposals:generate',
    'proposals:read',
    'tasks:read',
    'tasks:manage',
    'tasks:comment',
    'milestones:read',
    'milestones:manage',
    'tickets:create',
    'tickets:read_all',
    'tickets:manage',
  ],
  developer: [
    'org:read',
    'members:read',
    'projects:read_all',
    'projects:update',
    'proposals:read',
    'tasks:read',
    'tasks:manage',
    'tasks:comment',
    'milestones:read',
    'tickets:create',
    'tickets:read_all',
    'tickets:manage',
  ],
  client: [
    'org:read',
    'projects:create',
    'proposals:generate',
    'proposals:read',
    'tasks:read',
    'tasks:comment',
    'milestones:read',
    'tickets:create',
  ],
}

const PLATFORM_PERMISSIONS = ['platform:orgs', 'platform:stats']

const permissionSets = Object.fromEntries(
  Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => [role, new Set(perms)])
)

// ctx = req.ctx from the auth middleware
function can(ctx, permission) {
  if (!ctx) return false
  if (PLATFORM_PERMISSIONS.includes(permission)) return Boolean(ctx.isSuperAdmin)
  // Super admins act as org_admin in whichever org they've switched into.
  const role = ctx.isSuperAdmin && ctx.orgId ? 'org_admin' : ctx.orgRole
  return Boolean(role && permissionSets[role]?.has(permission))
}

function permissionsFor(ctx) {
  const all = new Set()
  for (const perm of Object.values(ROLE_PERMISSIONS).flat().concat(PLATFORM_PERMISSIONS)) {
    if (can(ctx, perm)) all.add(perm)
  }
  return [...all].sort()
}

// Express middleware: 403 unless the current user has `permission`.
function requirePermission(permission) {
  return (req, res, next) => {
    if (can(req.ctx, permission)) return next()
    return res.status(403).json({ message: 'You do not have permission to do this', code: 'FORBIDDEN' })
  }
}

// Staff = people who work for the agency (see all of the org's projects).
function isStaff(ctx) {
  return can(ctx, 'projects:read_all')
}

module.exports = { ROLES, ROLE_PERMISSIONS, can, permissionsFor, requirePermission, isStaff }
