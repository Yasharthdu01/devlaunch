'use client'
import { useState } from 'react'
import Link from 'next/link'
import API_URL, { waLink } from '@/lib/config'
import {
  ArrowLeft, Search, CheckCircle2, AlertTriangle, XCircle, Loader2, ArrowRight,
} from 'lucide-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

type Finding = {
  key: string
  label: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  recommendation: string | null
}
type Report = {
  score: number
  summary: string
  fails: number
  warns: number
  findings: Finding[]
  finalUrl?: string
  loadMs?: number
}

const spinSx = {
  animation: 'auditspin 1s linear infinite',
  '@keyframes auditspin': { from: { transform: 'rotate(0)' }, to: { transform: 'rotate(360deg)' } },
}
const Spinner = ({ color = 'currentColor' }: { color?: string }) => (
  <Box component="span" sx={{ display: 'inline-flex', ...spinSx }}><Loader2 size={18} color={color} /></Box>
)

const SCAN_STEPS = [
  'Loading your homepage…',
  'Measuring load speed…',
  'Checking mobile experience…',
  'Looking for a WhatsApp button…',
  'Auditing SEO & social previews…',
  'Writing your report…',
]

const STATUS_UI = {
  pass: { color: '#16a34a', bg: 'rgba(22,163,74,0.10)', Icon: CheckCircle2, label: 'Good' },
  warn: { color: '#d97706', bg: 'rgba(217,119,6,0.10)', Icon: AlertTriangle, label: 'Improve' },
  fail: { color: '#dc2626', bg: 'rgba(220,38,38,0.10)', Icon: XCircle, label: 'Fix' },
} as const

function scoreColor(s: number) {
  if (s >= 85) return '#16a34a'
  if (s >= 60) return '#d97706'
  return '#dc2626'
}

export default function AuditPage() {
  const [url, setUrl]         = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep]       = useState(0)
  const [report, setReport]   = useState<Report | null>(null)
  const [error, setError]     = useState('')

  // Lead capture (shown with the report)
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent]   = useState(false)

  async function runAudit() {
    if (!url.trim()) return
    setError('')
    setReport(null)
    setSent(false)
    setLoading(true)
    setStep(0)

    // Cosmetic progress while the real fetch runs in the background.
    const ticker = setInterval(
      () => setStep(s => (s < SCAN_STEPS.length - 1 ? s + 1 : s)),
      650
    )

    try {
      const res = await fetch(API_URL + '/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Could not run the audit. Check the URL and try again.')
      } else {
        setReport(data)
      }
    } catch {
      setError('Something went wrong. Make sure the backend is running on port 5000.')
    } finally {
      clearInterval(ticker)
      setLoading(false)
    }
  }

  async function submitLead() {
    if (!email.trim() && !phone.trim()) return
    try {
      await fetch(API_URL + '/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          industry: 'Website Audit',
          message:
            `Audit lead from the free tool.\n` +
            `URL: ${report?.finalUrl || url}\n` +
            `Score: ${report?.score}/100 (${report?.fails} critical, ${report?.warns} warnings).\n` +
            `Wants help fixing the issues.`,
        }),
      })
      setSent(true)
    } catch {
      setSent(true) // lead UX shouldn't fail loudly
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-primary)' }}>
      {/* Header */}
      <Box sx={{ borderBottom: '1px solid var(--border)', px: 3, py: 2 }}>
        <Box sx={{ maxWidth: 880, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component={Link} href="/" sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--blue)', textDecoration: 'none' }}>
            Dev<Box component="span" sx={{ color: 'var(--text-primary)' }}>Launch</Box>
          </Typography>
          <Button component={Link} href="/" startIcon={<ArrowLeft size={16} />}
            sx={{ textTransform: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Back to home
          </Button>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, py: { xs: 5, md: 7 } }}>
        {/* Hero + input */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, mb: 3, borderRadius: '9999px', bgcolor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)' }}>
              ⚡ Free · No sign-up · Instant
            </Typography>
          </Box>
          <Typography component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.02em', mb: 2 }}>
            Is your website costing<br />you customers?
          </Typography>
          <Typography sx={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 560, mx: 'auto', mb: 4, lineHeight: 1.6 }}>
            Drop your website or Instagram link below. In seconds we'll check load speed,
            mobile-friendliness, WhatsApp button, SEO and more — then show you exactly what to fix.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, maxWidth: 620, mx: 'auto' }}>
            <TextField
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') runAudit() }}
              placeholder="yourbusiness.com  or  @yourhandle"
              fullWidth size="small" disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'var(--bg-primary)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '0.95rem' } }}
            />
            <Button
              onClick={runAudit} disabled={loading || !url.trim()}
              variant="contained" disableElevation
              startIcon={loading ? <Spinner color="#fff" /> : <Search size={18} />}
              sx={{ px: 3, py: 1.25, bgcolor: 'var(--blue)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', borderRadius: '12px', textTransform: 'none', whiteSpace: 'nowrap', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
            >
              {loading ? 'Scanning…' : 'Run free audit'}
            </Button>
          </Box>
          {error && <Typography sx={{ mt: 2, color: '#dc2626', fontSize: '0.875rem' }}>{error}</Typography>}
        </Box>

        {/* Scanning state */}
        {loading && (
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', p: 4, maxWidth: 520, mx: 'auto' }}>
            {SCAN_STEPS.map((s, i) => (
              <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, opacity: i <= step ? 1 : 0.35, transition: 'opacity 0.3s' }}>
                {i < step
                  ? <CheckCircle2 size={18} color="#16a34a" />
                  : i === step
                    ? <Spinner color="var(--blue)" />
                    : <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border)' }} />}
                <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s}</Typography>
              </Box>
            ))}
          </Paper>
        )}

        {/* Report */}
        {report && !loading && (
          <Box>
            {/* Score header */}
            <Paper elevation={0} sx={{ bgcolor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', p: { xs: 3, md: 4 }, mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
              <Box sx={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                <Box sx={{ width: 120, height: 120, borderRadius: '50%', background: `conic-gradient(${scoreColor(report.score)} ${report.score * 3.6}deg, var(--border) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: scoreColor(report.score), lineHeight: 1 }}>{report.score}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>out of 100</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                  Audit for {report.finalUrl || url}
                </Typography>
                <Typography sx={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                  {report.summary}
                </Typography>
                {report.loadMs != null && (
                  <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-muted)', mt: 1 }}>
                    {report.fails} critical · {report.warns} to improve · loaded in {(report.loadMs / 1000).toFixed(1)}s
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Findings */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
              {report.findings.map(f => {
                const ui = STATUS_UI[f.status]
                return (
                  <Paper key={f.key} elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', p: 2.5, display: 'flex', gap: 2 }}>
                    <Box sx={{ flexShrink: 0, width: 36, height: 36, borderRadius: '10px', bgcolor: ui.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ui.Icon size={20} color={ui.color} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{f.label}</Typography>
                        <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: ui.bg }}>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: ui.color }}>{ui.label}</Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', mt: 0.5 }}>{f.detail}</Typography>
                      {f.recommendation && (
                        <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-muted)', mt: 0.75, pl: 1.5, borderLeft: `2px solid ${ui.color}`, lineHeight: 1.5 }}>
                          💡 {f.recommendation}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                )
              })}
            </Box>

            {/* Lead capture CTA */}
            <Paper elevation={0} sx={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-dark))', borderRadius: '16px', p: { xs: 3, md: 4 }, textAlign: 'center' }}>
              {sent ? (
                <Box>
                  <CheckCircle2 size={40} color="#fff" style={{ marginBottom: 12 }} />
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', mb: 1 }}>Thanks — we'll be in touch!</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
                    Our team will reach out within a few hours with a fix plan. Prefer to chat now?
                  </Typography>
                  <Button component="a" href={waLink(`Hi! I just ran the free audit for ${report.finalUrl || url} (score ${report.score}). I'd like help fixing the issues.`)} target="_blank"
                    variant="contained" disableElevation
                    sx={{ mt: 2, bgcolor: '#fff', color: 'var(--blue)', fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#f1f5f9' } }}>
                    Chat on WhatsApp
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 800, color: '#fff', mb: 1 }}>
                    Want us to fix all of this for you?
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', mb: 3, maxWidth: 480, mx: 'auto' }}>
                    Leave your details and we'll send a free fix plan — no obligation. Most fixes ship in under a week.
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, maxWidth: 560, mx: 'auto', mb: 1.5 }}>
                    <TextField value={name} onChange={e => setName(e.target.value)} placeholder="Your name" size="small" fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: '10px', fontSize: '0.9rem' } }} />
                    <TextField value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone / WhatsApp" size="small" fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: '10px', fontSize: '0.9rem' } }} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, maxWidth: 560, mx: 'auto' }}>
                    <TextField value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" size="small" fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: '10px', fontSize: '0.9rem' } }} />
                    <Button onClick={submitLead} disabled={!email.trim() && !phone.trim()}
                      variant="contained" disableElevation endIcon={<ArrowRight size={18} />}
                      sx={{ px: 3, bgcolor: '#0f172a', color: '#fff', fontWeight: 700, borderRadius: '10px', textTransform: 'none', whiteSpace: 'nowrap', '&:hover': { bgcolor: '#1e293b' } }}>
                      Get my fix plan
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  )
}
