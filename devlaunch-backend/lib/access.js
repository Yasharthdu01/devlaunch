// Project-level authorization: a user may touch a project's data only if they
// own the project or are an admin. Used by routes that take a project id, a
// task id or a milestone id, so ownership can't be bypassed by guessing ids.

const pool = require('../db')

// Child tables whose rows belong to a project. Fixed whitelist: never interpolate user input.
const CHILD_TABLES = { tasks: 'tasks', milestones: 'milestones' }

async function userCanAccessProject(user, projectId) {
  if (!user) return false
  if (user.role === 'admin') return true
  const id = Number(projectId)
  if (!Number.isInteger(id) || id <= 0) return false
  const { rows } = await pool.query('SELECT 1 FROM projects WHERE id = $1 AND client_id = $2', [id, user.id])
  return rows.length > 0
}

function deny(res) {
  // 404 rather than 403, so callers can't probe which ids exist.
  return res.status(404).json({ message: 'Not found' })
}

// requireProjectAccess(req => req.params.project_id)
function requireProjectAccess(getProjectId) {
  return async (req, res, next) => {
    try {
      if (await userCanAccessProject(req.user, getProjectId(req))) return next()
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
      const id = Number(getRowId(req))
      if (!Number.isInteger(id) || id <= 0) return deny(res)
      const { rows } = await pool.query(`SELECT project_id FROM ${safeTable} WHERE id = $1`, [id])
      if (rows.length === 0) return deny(res)
      if (await userCanAccessProject(req.user, rows[0].project_id)) return next()
      return deny(res)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = { userCanAccessProject, requireProjectAccess, requireChildAccess }
