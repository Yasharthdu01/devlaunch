const express = require('express')
const router = express.Router()
const axios = require('axios')
const pool = require('../db')
const { sendMail, ADMIN_EMAIL } = require('../utils/mailer')

// Lead-gen "instant website audit" tool.
// It performs a REAL fetch of the visitor's URL, measures genuine signals
// (load time, HTTPS, mobile viewport, WhatsApp button, SEO basics) and turns
// those signals into a scored, human-readable report. The narrative is
// templated for now — swap in an LLM later without changing the front end.

async function ensureAuditTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audits (
      id SERIAL PRIMARY KEY,
      url VARCHAR(500),
      name VARCHAR(100),
      email VARCHAR(100),
      phone VARCHAR(20),
      score INT,
      report JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}
ensureAuditTable()

// Normalise whatever the user typed into a fetchable https URL.
function normaliseUrl(raw) {
  let u = (raw || '').trim()
  if (!u) return null
  // Bare instagram/social handles like "@cafemumbai" → instagram profile
  if (u.startsWith('@')) u = `https://instagram.com/${u.slice(1)}`
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`
  try {
    const parsed = new URL(u)
    return parsed.href
  } catch {
    return null
  }
}

const has = (html, re) => re.test(html)
const grab = (html, re) => {
  const m = html.match(re)
  return m ? (m[1] || '').trim() : ''
}

// Build a single finding row.
function finding(key, label, status, detail, recommendation) {
  return { key, label, status, detail, recommendation }
}

function analyse({ html, finalUrl, status, loadMs, bytes, usedHttps }) {
  const findings = []

  // 1. HTTPS / SSL
  findings.push(
    usedHttps
      ? finding('https', 'Secure connection (SSL)', 'pass',
          'Your site loads over HTTPS.', null)
      : finding('https', 'Secure connection (SSL)', 'fail',
          'Your site is served over plain HTTP.',
          'Add an SSL certificate — browsers show "Not secure" without it, which scares away customers.')
  )

  // 2. Load speed
  const speedStatus = loadMs <= 2500 ? 'pass' : loadMs <= 5000 ? 'warn' : 'fail'
  findings.push(finding('speed', 'Page load speed', speedStatus,
    `Homepage responded in ${(loadMs / 1000).toFixed(1)}s.`,
    speedStatus === 'pass' ? null
      : 'Slow pages lose ~1 customer for every extra second. We compress images, cache, and serve from a CDN to get this under 2s.'))

  // 3. Mobile viewport
  const mobile = has(html, /<meta[^>]+name=["']viewport["']/i)
  findings.push(mobile
    ? finding('mobile', 'Mobile-friendly', 'pass', 'A mobile viewport is configured.', null)
    : finding('mobile', 'Mobile-friendly', 'fail',
        'No mobile viewport tag found — the site likely renders zoomed-out on phones.',
        'Over 75% of Indian customers browse on mobile. We rebuild this mobile-first so it looks right on every phone.'))

  // 4. WhatsApp button — the big one for Indian SMBs
  const wa = has(html, /wa\.me|api\.whatsapp\.com|whatsapp:\/\/|web\.whatsapp\.com/i)
  findings.push(wa
    ? finding('whatsapp', 'WhatsApp contact button', 'pass',
        'Customers can reach you on WhatsApp directly.', null)
    : finding('whatsapp', 'WhatsApp contact button', 'fail',
        'No WhatsApp link found anywhere on the page.',
        'This is the #1 way Indian customers want to talk to you. A floating WhatsApp button typically lifts enquiries 30-40%.'))

  // 5. Click-to-call
  const tel = has(html, /href=["']tel:/i)
  findings.push(tel
    ? finding('phone', 'Click-to-call number', 'pass', 'A tappable phone number is present.', null)
    : finding('phone', 'Click-to-call number', 'warn',
        'No tap-to-call phone link detected.',
        'Add a tap-to-call button so mobile visitors reach you in one tap.'))

  // 6. Title tag (SEO)
  const title = grab(html, /<title[^>]*>([^<]*)<\/title>/i)
  const titleStatus = !title ? 'fail' : title.length < 10 || title.length > 65 ? 'warn' : 'pass'
  findings.push(finding('title', 'Page title (Google ranking)', titleStatus,
    title ? `Title: "${title.slice(0, 70)}"` : 'No <title> tag found.',
    titleStatus === 'pass' ? null
      : 'A clear, keyword-rich title is what Google shows in search results. We write these to match what your customers search for.'))

  // 7. Meta description
  const desc = grab(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)
  findings.push(desc
    ? finding('description', 'Search description', 'pass', 'A meta description is set.', null)
    : finding('description', 'Search description', 'warn',
        'No meta description — Google will guess what your business does.',
        'We add a compelling description so your search listing actually sells.'))

  // 8. Social sharing (Open Graph)
  const og = has(html, /property=["']og:(title|image)["']/i)
  findings.push(og
    ? finding('social', 'Social sharing preview', 'pass',
        'Links shared on WhatsApp/Instagram show a rich preview.', null)
    : finding('social', 'Social sharing preview', 'warn',
        'No Open Graph tags — links shared on WhatsApp show as plain text.',
        'We add preview images so your links look professional when shared.'))

  // 9. Headline structure
  const h1 = has(html, /<h1[^>]*>/i)
  findings.push(h1
    ? finding('h1', 'Clear headline (H1)', 'pass', 'A primary headline is present.', null)
    : finding('h1', 'Clear headline (H1)', 'warn',
        'No H1 headline found — visitors and Google both look for one.',
        'We add a strong headline that tells visitors what you offer in 3 seconds.'))

  // Score: pass = 1, warn = 0.5, fail = 0 — weighted equally, rounded.
  const weight = { pass: 1, warn: 0.5, fail: 0 }
  const score = Math.round(
    (findings.reduce((s, f) => s + weight[f.status], 0) / findings.length) * 100
  )

  const fails = findings.filter(f => f.status === 'fail').length
  const warns = findings.filter(f => f.status === 'warn').length

  let summary
  if (score >= 85) summary = "Your online presence is in good shape — a few quick wins would make it excellent."
  else if (score >= 60) summary = `Solid foundation, but ${fails + warns} issues are quietly costing you customers.`
  else summary = `Your site has ${fails} serious gaps that are likely losing you enquiries every day. The good news: all of them are fixable.`

  return { score, summary, fails, warns, findings, finalUrl, status, loadMs }
}

router.post('/', async (req, res) => {
  const { url, name, email, phone } = req.body
  const target = normaliseUrl(url)

  if (!target) {
    return res.status(400).json({ message: 'Please enter a valid website or Instagram URL.' })
  }

  const startedAt = process.hrtime.bigint()
  let report

  try {
    const response = await axios.get(target, {
      timeout: 12000,
      maxRedirects: 5,
      // Pretend to be a real browser so sites don't serve us a bot page.
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      validateStatus: () => true, // we want to report on 4xx/5xx too
      responseType: 'text',
      maxContentLength: 5 * 1024 * 1024,
    })

    const loadMs = Number((process.hrtime.bigint() - startedAt) / 1000000n)
    const html = typeof response.data === 'string' ? response.data : ''
    const finalUrl = response.request?.res?.responseUrl || target

    report = analyse({
      html,
      finalUrl,
      status: response.status,
      loadMs,
      bytes: Buffer.byteLength(html),
      usedHttps: finalUrl.startsWith('https://'),
    })
  } catch (err) {
    // Site unreachable / timed out — still a useful (negative) signal.
    const loadMs = Number((process.hrtime.bigint() - startedAt) / 1000000n)
    report = {
      score: 0,
      summary:
        "We couldn't load your site at all within 12 seconds. If it's live, it's far too slow or blocking visitors — either way, customers are bouncing before they see you.",
      fails: 1,
      warns: 0,
      finalUrl: target,
      loadMs,
      unreachable: true,
      findings: [
        finding('reachable', 'Website reachable', 'fail',
          `We could not load ${target} (${err.code || err.message}).`,
          'A fast, always-on site is the baseline. We host on reliable infrastructure with 99.9% uptime.'),
      ],
    }
  }

  // Persist the lead + report (best-effort — never block the response).
  pool.query(
    `INSERT INTO audits (url, name, email, phone, score, report)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [target, name || null, email || null, phone || null, report.score, report]
  ).catch(err => console.error('audit save failed:', err.message))

  // Notify the business when someone leaves contact details.
  if (email || phone) {
    sendMail({
      to: ADMIN_EMAIL,
      subject: `New audit lead — ${name || email || phone} (score ${report.score})`,
      text:
        `Someone ran a website audit and left contact details.\n\n` +
        `Name: ${name || '—'}\nEmail: ${email || '—'}\nPhone: ${phone || '—'}\n` +
        `URL audited: ${target}\nScore: ${report.score}/100\n` +
        `Issues: ${report.fails} critical, ${report.warns} warnings\n`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
          <h2 style="color:#2563eb">New audit lead — score ${report.score}/100</h2>
          <ul style="font-size:14px;line-height:1.8">
            <li><b>Name:</b> ${name || '—'}</li>
            <li><b>Email:</b> ${email || '—'}</li>
            <li><b>Phone:</b> ${phone || '—'}</li>
            <li><b>URL:</b> ${target}</li>
            <li><b>Score:</b> ${report.score}/100 (${report.fails} critical, ${report.warns} warnings)</li>
          </ul>
        </div>`,
    }).catch(() => {})
  }

  res.json(report)
})

// Admin view of captured audit leads.
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, url, name, email, phone, score, created_at FROM audits ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
