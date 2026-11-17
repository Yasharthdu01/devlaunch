// Append-only audit trail of security-relevant actions (role changes,
// invitations, suspensions, deletions...). Named auditLog to avoid confusion
// with the website-audit lead tool in routes/audit.js.
//
// Writing an audit entry must never break the action itself, so failures are
// logged and swallowed.

const pool = require('../db')

async function recordAudit(req, action, { entityType = null, entityId = null, metadata = {}, orgId } = {}) {
  try {
    await pool.query(
      `INSERT INTO audit_log (org_id, actor_id, action, entity_type, entity_id, metadata, ip)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        orgId !== undefined ? orgId : req.ctx?.orgId ?? null,
        req.ctx?.userId ?? null,
        action,
        entityType,
        entityId === null ? null : String(entityId),
        JSON.stringify(metadata),
        req.ip || null,
      ]
    )
  } catch (err) {
    console.error(`[audit] failed to record ${action}: ${err.message}`)
  }
}

module.exports = { recordAudit }
