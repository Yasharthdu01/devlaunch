'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { saveSession, homePathFor, ROLE_LABELS } from '@/lib/session'

interface InvitePreview { org_name: string; email: string; role: string; has_account: boolean }

const INDUSTRIES = ['Travel & Hospitality', 'E-commerce', 'Healthcare', 'EdTech', 'SaaS', 'Marketing', 'Other']

function RegisterForm() {
  const router = useRouter()
  const params = useSearchParams()
  const inviteToken = params.get('invite') || ''
  const [accountType, setAccountType] = useState<'client' | 'agency'>(params.get('type') === 'agency' ? 'agency' : 'client')
  const [invite, setInvite] = useState<InvitePreview | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company_name: '',
    industry: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Invited people sign up into the inviting org with a fixed email.
  useEffect(() => {
    if (!inviteToken) return
    fetch(API_URL + `/api/invitations/${encodeURIComponent(inviteToken)}`)
      .then(async r => {
        const data = await r.json()
        if (!r.ok) { setError(data.message || 'This invitation link is invalid or has expired'); return }
        setInvite(data)
        setForm(f => ({ ...f, email: data.email }))
      })
      .catch(() => setError('Could not load the invitation'))
  }, [inviteToken])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(API_URL + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          account_type: invite ? 'client' : accountType,
          agency_name: accountType === 'agency' && !invite ? form.company_name : undefined,
          invite_token: invite ? inviteToken : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed')
        setLoading(false)
        return
      }

      saveSession(data.token, data.user)
      router.push(homePathFor(data.user))

    } catch (err) {
      setError('Server error. Make sure backend is running.')
      setLoading(false)
    }
  }

  const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 } as const

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--bg-secondary)', p: 2 }}>
      <Paper
        elevation={0}
        sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 4, width: '100%', maxWidth: 420 }}
      >

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue)' }}>DevLaunch</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.5 }}>AI delivery platform</Typography>
        </Box>

        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>
          {invite ? `Join ${invite.org_name}` : 'Create account'}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mb: 3 }}>
          {invite
            ? `You've been invited as ${ROLE_LABELS[invite.role]?.toLowerCase() || invite.role}.`
            : accountType === 'agency' ? 'Run your agency’s clients, proposals and delivery in one place' : 'Start your project today'}
        </Typography>

        {invite?.has_account && (
          <Alert severity="info" sx={{ borderRadius: '12px', mb: 2.5 }}>
            You already have an account.{' '}
            <Link href={`/login?next=${encodeURIComponent(`/invite?token=${inviteToken}`)}`}>Log in to accept</Link>
          </Alert>
        )}

        {!inviteToken && (
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={accountType}
            onChange={(_, v) => v && setAccountType(v)}
            sx={{ mb: 2.5, '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, borderRadius: '8px' } }}
          >
            <ToggleButton value="client">I need a project built</ToggleButton>
            <ToggleButton value="agency">I run an agency</ToggleButton>
          </ToggleButtonGroup>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: '12px', mb: 2.5 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          <Box>
            <Typography sx={labelSx}>Full name</Typography>
            <TextField
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Yasharth Dubey"
              required
              size="small"
              fullWidth
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>Email</Typography>
            <TextField
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              size="small"
              fullWidth
              disabled={Boolean(invite)}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>Password</Typography>
            <TextField
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              size="small"
              fullWidth
              slotProps={{ htmlInput: { minLength: 8 } }}
              helperText="At least 8 characters"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={labelSx}>{accountType === 'agency' && !invite ? 'Agency name' : 'Company name'}</Typography>
              <TextField
                type="text"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                required={accountType === 'agency' && !invite}
                placeholder={accountType === 'agency' && !invite ? 'Acme Studio' : 'Traveler Co.'}
                size="small"
                fullWidth
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={labelSx}>Industry</Typography>
              <TextField
                select
                name="industry"
                value={form.industry}
                onChange={handleChange}
                size="small"
                fullWidth
              >
                <MenuItem value="">Select...</MenuItem>
                {INDUSTRIES.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </TextField>
            </Box>
          </Box>

          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            disableElevation
            fullWidth
            sx={{ bgcolor: 'var(--blue)', color: '#fff', borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1, mt: 0.5, '&:hover': { bgcolor: 'var(--blue-dark)' } }}
          >
            {loading ? 'Creating account...' : invite ? `Join ${invite.org_name}` : accountType === 'agency' ? 'Create agency workspace' : 'Create account'}
          </Button>

        </Box>

        <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', mt: 3 }}>
          Already have an account?{' '}
          <Typography
            component={Link}
            href="/login"
            sx={{ color: 'var(--blue)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Sign in
          </Typography>
        </Typography>

      </Paper>
    </Box>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}
