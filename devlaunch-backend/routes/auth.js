const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { z } = require('zod')
const rateLimit = require('express-rate-limit')
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
const { loadContext } = require('../middleware/auth')
const { sendMail, ADMIN_EMAIL } = require('../utils/mailer')
const { validateBody } = require('../lib/http')
const { signToken, userPayload } = require('../lib/session')
const { recordAudit } = require('../lib/auditLog')
const escapeHtml = require('../lib/escapeHtml')
const {
  withTransaction,
  createOrganization,
  defaultOrgId,
  findPendingInvitation,
  acceptInvitation,
} = require('../lib/orgs')
require('dotenv').config()

// Slow down credential stuffing / signup spam.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT_PER_15MIN) || 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.', code: 'RATE_LIMITED' },
})

const email = z.string().trim().toLowerCase().email().max(100)

const registerSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email,
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
    company_name: z.string().trim().max(100).optional().nullable(),
    industry: z.string().trim().max(100).optional().nullable(),
    // 'client' joins the DevLaunch agency (or the org that invited them);
    // 'agency' creates a new organization with this user as its admin.
    account_type: z.enum(['client', 'agency']).optional().default('client'),
    agency_name: z.string().trim().min(2).max(120).optional(),
    invite_token: z.string().max(200).optional(),
  })
  .refine(v => v.account_type !== 'agency' || v.agency_name || v.company_name, {
    message: 'Agency name is required',
    path: ['agency_name'],
  })

const loginSchema = z.object({ email, password: z.string().min(1).max(128) })

const updateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  company_name: z.string().trim().max(100).optional().nullable(),
  industry: z.string().trim().max(100).optional().nullable(),
})

// POST /api/auth/register
router.post('/register', authLimiter, validateBody(registerSchema), async (req, res) => {
  const { name, email, password, company_name, industry, account_type, agency_name, invite_token } = req.body

  try {
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    let invite = null
    if (invite_token) {
      invite = await findPendingInvitation(pool, invite_token)
      if (!invite) return res.status(400).json({ message: 'This invitation link is invalid or has expired' })
      if (invite.email !== email) {
        return res.status(400).json({ message: `This invitation was sent to ${invite.email}. Sign up with that email.` })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { userId, joined } = await withTransaction(async db => {
      // users.role is legacy and never grants anything; memberships do.
      const created = await db.query(
        `INSERT INTO users (name, email, password, company_name, industry, role)
         VALUES ($1, $2, $3, $4, $5, 'client') RETURNING id`,
        [name, email, hashedPassword, company_name ?? null, industry ?? null]
      )
      const userId = created.rows[0].id

      if (invite) {
        await acceptInvitation(db, invite, userId)
        return { userId, joined: { orgId: invite.org_id, how: 'invitation', role: invite.role } }
      }
      if (account_type === 'agency') {
        const org = await createOrganization(db, { name: agency_name || company_name, userId })
        return { userId, joined: { orgId: org.id, how: 'agency_signup', role: 'org_admin' } }
      }
      const orgId = await defaultOrgId(db)
      await db.query(`INSERT INTO memberships (user_id, org_id, role) VALUES ($1, $2, 'client')`, [userId, orgId])
      return { userId, joined: { orgId, how: 'public_signup', role: 'client' } }
    })

    const ctx = await loadContext(userId, joined.orgId)
    req.ctx = ctx
    await recordAudit(req, 'user.registered', {
      entityType: 'user',
      entityId: userId,
      metadata: { how: joined.how, role: joined.role },
      orgId: joined.orgId,
    })

    const kind = joined.how === 'agency_signup' ? 'agency' : 'account'
    sendMail({
      to: ADMIN_EMAIL,
      subject: `New ${kind} created — ${name} (${agency_name || company_name || 'no company'})`,
      text:
        `A new ${kind} was created on DevLaunch.\n\n` +
        `Name: ${name}\nEmail: ${email}\nCompany: ${company_name || '—'}\nIndustry: ${industry || '—'}\nJoined via: ${joined.how}\n`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#111">
          <h2 style="color:#2563eb">New ${kind} created</h2>
          <ul style="font-size:14px;line-height:1.8">
            <li><b>Name:</b> ${escapeHtml(name)}</li>
            <li><b>Email:</b> ${escapeHtml(email)}</li>
            <li><b>Company:</b> ${escapeHtml(agency_name || company_name || '—')}</li>
            <li><b>Industry:</b> ${escapeHtml(industry || '—')}</li>
            <li><b>Joined via:</b> ${escapeHtml(joined.how)}</li>
          </ul>
        </div>`,
    }).catch(() => {})

    res.status(201).json({ token: signToken({ id: userId, email }), user: userPayload(ctx) })
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Email already registered' })
    console.error('[auth] register failed:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', authLimiter, validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT id, email, password FROM users WHERE LOWER(email) = $1', [email])
    const user = result.rows[0]
    // Compare against a dummy hash when the user doesn't exist so response
    // time doesn't reveal which emails are registered.
    const hash = user?.password || '$2b$10$PrIbGVo2zaJYTQIXFfUMd.EZ5JgicqubLX.eSgWc/tqIFbAJ1dyka'
    const isMatch = await bcrypt.compare(password, hash)
    if (!user || !isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const ctx = await loadContext(user.id)
    if (ctx.org && ctx.org.status !== 'active' && !ctx.isSuperAdmin) {
      return res.status(403).json({ message: 'This organization is suspended. Contact support.', code: 'ORG_SUSPENDED' })
    }
    res.json({ token: signToken(user), user: userPayload(ctx) })
  } catch (err) {
    console.error('[auth] login failed:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json(userPayload(req.ctx))
})

// PATCH /api/auth/update
router.patch('/update', authMiddleware, validateBody(updateSchema), async (req, res) => {
  const { name, company_name, industry } = req.body
  try {
    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        company_name = COALESCE($2, company_name),
        industry = COALESCE($3, industry)
       WHERE id = $4
       RETURNING id, name, email, company_name, industry`,
      [name ?? null, company_name ?? null, industry ?? null, req.ctx.userId]
    )
    res.json({ ...result.rows[0], role: req.user.role })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
