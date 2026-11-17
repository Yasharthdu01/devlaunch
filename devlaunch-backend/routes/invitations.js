// Invitation links: preview (public) and accept (logged in).
const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { loadContext } = require('../middleware/auth')
const { recordAudit } = require('../lib/auditLog')
const { userPayload } = require('../lib/session')
const { withTransaction, findPendingInvitation, acceptInvitation } = require('../lib/orgs')

// Tokens are 256-bit random, but still cap guessing attempts.
const lookupLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false })

// GET /api/invitations/:token — what is this invite for?
router.get('/:token', lookupLimiter, async (req, res) => {
  try {
    const invite = await findPendingInvitation(pool, req.params.token)
    if (!invite) return res.status(404).json({ message: 'This invitation link is invalid or has expired' })
    const existing = await pool.query('SELECT 1 FROM users WHERE LOWER(email) = $1', [invite.email])
    res.json({
      org_name: invite.org_name,
      email: invite.email,
      role: invite.role,
      expires_at: invite.expires_at,
      has_account: existing.rows.length > 0,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/invitations/:token/accept — for people who already have an account
router.post('/:token/accept', lookupLimiter, authMiddleware, async (req, res) => {
  try {
    const invite = await findPendingInvitation(pool, req.params.token)
    if (!invite) return res.status(404).json({ message: 'This invitation link is invalid or has expired' })
    if (invite.email !== String(req.ctx.email).toLowerCase()) {
      return res.status(403).json({ message: `This invitation was sent to ${invite.email}. Log in with that account to accept it.` })
    }
    await withTransaction(db => acceptInvitation(db, invite, req.ctx.userId))
    await recordAudit(req, 'member.joined', {
      entityType: 'user',
      entityId: req.ctx.userId,
      metadata: { role: invite.role, via: 'invitation' },
      orgId: invite.org_id,
    })
    const ctx = await loadContext(req.ctx.userId, invite.org_id)
    res.json({ user: userPayload(ctx) })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
