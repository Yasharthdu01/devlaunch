// Project-level authorization inside a tenant.
//
// A user can reach a project's data only if the project is in their active
// organization AND either
//   - they're staff there (org_admin / developer, or a super admin), or
//   - they're the project's client.
// Used by every route that takes a project, task or milestone id, so neither
// another client's project nor another agency's data can be reached by
// guessing ids. Denials are 404, not 403, so ids can't be probed.

const pool = require('../db')
const { isStaff } = require('./rbac')

// Child tables whose rows belong to a project. Fixed whitelist: never interpolate user input.
const CHILD_TABLES = { tasks: 'tasks', milestones: 'milestones' }

function toId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

async function userCanAccessProject(ctx, projectId) {
  const id = toId(projectId)
  if (!ctx || !ctx.orgId || !id) return false
  const { rows } = await pool.query('SELECT org_id, client_id FROM projects WHERE id = $1', [id])
  if (rows.length === 0) return false
  const project = rows[0]
  if (project.org_id !== ctx.orgId) return false
  return isStaff(ctx) || project.client_id === ctx.userId
}

// SQL WHERE fragment that limits a projects query (aliased `p`) to what the
// caller may see. Parameters are appended to `params`; returns the fragment.
function projectScope(ctx, params, alias = 'p') {
  params.push(ctx.orgId)
  let sql = `${alias}.org_id = $${params.length}`
  if (!isStaff(ctx)) {
    params.push(ctx.userId)
    sql += ` AND ${alias}.client_id = $${params.length}`
  }
  return sql
}

function deny(res) {
  return res.status(404).json({ message: 'Not found' })
}

// requireProjectAccess(req => req.params.project_id)
function requireProjectAccess(getProjectId) {
  return async (req, res, next) => {
    try {
      if (await userCanAccessProject(req.ctx, getProjectId(req))) return next()
      return deny(res)
    } catch (err) {
      next(err)
    }
  }
}

// requireChildAccess('tasks', req => req.params.id): resolves the row's project first.
function requireChildAccess(table, getRowId) {
  const safeTable = CHILD_TABLES[table]
  if (!safeTable) throw new Error(`Unknown table for access check: ${table}`)
  return async (req, res, next) => {
    try {
      const id = toId(getRowId(req))
      if (!id) return deny(res)
      const { rows } = await pool.query(`SELECT project_id FROM ${safeTable} WHERE id = $1`, [id])
      if (rows.length === 0) return deny(res)
      if (await userCanAccessProject(req.ctx, rows[0].project_id)) {
        req.projectId = rows[0].project_id
        return next()
      }
      return deny(res)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = { userCanAccessProject, requireProjectAccess, requireChildAccess, projectScope, toId }
