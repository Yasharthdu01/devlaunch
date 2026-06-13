const nodemailer = require('nodemailer')
require('dotenv').config()

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'webandagent@devlaunch.in'

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env

const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)

let transporter = null
if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10) || 587,
    secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for 587/others
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
} else {
  console.warn(
    '⚠️  SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS in .env). ' +
    'Emails will be skipped — submissions are still saved to the database.'
  )
}

/**
 * Best-effort email send. Never throws — logs and resolves so that the
 * user-facing request always succeeds. The DB record is the source of truth.
 */
async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.warn(`✉️  [skipped] "${subject}" → ${to || ADMIN_EMAIL} (SMTP not configured)`)
    return { skipped: true }
  }
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: to || ADMIN_EMAIL,
      subject,
      text,
      html,
    })
    console.log(`✉️  sent "${subject}" → ${to || ADMIN_EMAIL} (${info.messageId})`)
    return { sent: true, messageId: info.messageId }
  } catch (err) {
    console.error(`✉️  failed to send "${subject}":`, err.message)
    return { error: err.message }
  }
}

module.exports = { sendMail, ADMIN_EMAIL }
