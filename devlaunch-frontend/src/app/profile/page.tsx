'use client'
import { useState, useEffect } from 'react'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Link from 'next/link'

interface User {
  id:           number
  name:         string
  email:        string
  role:         string
  company_name: string
  industry:     string
}

interface Project {
  id:         number
  title:      string
  status:     string
  budget_min: number
  created_at: string
}

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  discovery:   { bg: '#f3f4f6', fg: '#4b5563' },
  design:      { bg: '#faf5ff', fg: '#7e22ce' },
  development: { bg: '#eff6ff', fg: '#1d4ed8' },
  testing:     { bg: '#fffbeb', fg: '#b45309' },
  deploy:      { bg: '#fff7ed', fg: '#c2410c' },
  live:        { bg: '#f0fdf4', fg: '#15803d' },
  delivered:   { bg: '#f0fdfa', fg: '#0f766e' },
}

const INDUSTRIES = ['Travel & Hospitality', 'E-commerce', 'Healthcare', 'EdTech', 'SaaS', 'Marketing', 'Other']

const QUICK_LINKS = [
  { href: '/wizard',   label: 'Start new project',     primary: true  },
  { href: '/tracker',  label: 'View live tracker',     primary: false },
  { href: '/chatbot',  label: 'Ask AI assistant',      primary: false },
  { href: '/proposal', label: 'View proposal',         primary: false },
  { href: '/support',  label: 'Submit support ticket', primary: false },
]

export default function ProfilePage() {
  const [user,     setUser]     = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [editing,  setEditing]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState({ name: '', company_name: '', industry: '' })
  const [saved, setSaved] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetchProfile()
    fetchProjects()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch(API_URL + '/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUser(data)
      setForm({
        name:         data.name         || '',
        company_name: data.company_name || '',
        industry:     data.industry     || '',
      })
    } catch {}
  }

  async function fetchProjects() {
    try {
      const res = await fetch(API_URL + '/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch {}
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function saveProfile() {
    setSaving(true)
    try {
      await fetch(API_URL + '/api/auth/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      setUser(prev => prev ? { ...prev, ...form } : null)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    setSaving(false)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const totalInvested = projects.reduce((sum, p) => sum + (p.budget_min || 0), 0)

  if (!user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading profile...</Typography>
      </Box>
    )
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 } as const

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', width: '100%' }}>

      {/* Profile hero */}
      <Paper elevation={0} sx={{ bgcolor: 'var(--blue)', borderRadius: '16px', p: 3, mb: 2.5, color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.name}</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', mt: 0.25 }}>
              {user.company_name || 'No company set'} · {user.industry || 'No industry set'}
            </Typography>
            <Chip
              label={user.role}
              size="small"
              sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', textTransform: 'capitalize', fontSize: '0.7rem' }}
            />
          </Box>
          <Button
            onClick={() => setEditing(!editing)}
            disableElevation
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
          >
            {editing ? 'Cancel' : 'Edit profile'}
          </Button>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 6, mt: 2.5, pt: 2.5, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>{projects.length}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', mt: 0.25 }}>Projects</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {totalInvested > 0 ? `₹${(totalInvested / 100000).toFixed(1)}L` : '₹0'}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', mt: 0.25 }}>Invested</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {projects.filter(p => p.status === 'live' || p.status === 'delivered').length}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', mt: 0.25 }}>Completed</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Saved success */}
      {saved && (
        <Alert severity="success" sx={{ borderRadius: '12px', mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      {/* Edit form */}
      {editing && (
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--blue)', borderRadius: '16px', p: 2.5, mb: 2.5 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', mb: 2 }}>
            Edit profile
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              size="small"
              fullWidth
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Company name"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                size="small"
                fullWidth
              />
              <TextField
                select
                label="Industry"
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
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                onClick={saveProfile}
                disabled={saving}
                variant="contained"
                disableElevation
                sx={{ flex: 1, bgcolor: 'var(--blue)', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
              >
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
              <Button
                onClick={() => setEditing(false)}
                variant="outlined"
                sx={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Account details + Quick links */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mb: 2.5 }}>

        {/* Account details */}
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
          <Typography sx={labelSx}>Account details</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '0.875rem' }}>
            {[
              { k: 'Email',     v: user.email, small: true },
              { k: 'Role',      v: user.role,  cap: true },
              { k: 'Company',   v: user.company_name || '—' },
              { k: 'Industry',  v: user.industry || '—' },
              { k: 'Member ID', v: `#${user.id}` },
            ].map(row => (
              <Box key={row.k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{row.k}</Typography>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontSize: row.small ? '0.75rem' : '0.875rem',
                    textTransform: row.cap ? 'capitalize' : 'none',
                    textAlign: 'right',
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {row.v}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Quick links */}
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
          <Typography sx={labelSx}>Quick links</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {QUICK_LINKS.map(link => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                fullWidth
                variant={link.primary ? 'contained' : 'outlined'}
                disableElevation
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  ...(link.primary
                    ? { bgcolor: 'var(--blue)', color: '#fff', '&:hover': { bgcolor: 'var(--blue-dark)' } }
                    : { borderColor: 'var(--border)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' } }),
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Paper>

      </Box>

      {/* Projects list */}
      {projects.length > 0 && (
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, mb: 2.5 }}>
          <Typography sx={labelSx}>My projects</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {projects.map((p, i) => {
              const c = STATUS_COLORS[p.status] || STATUS_COLORS.discovery
              return (
                <Box
                  key={p.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.25,
                    borderBottom: i === projects.length - 1 ? 'none' : '1px solid var(--border-light)',
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25 }}>
                      {p.created_at
                        ? `Started ${new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        : 'Recently started'}
                    </Typography>
                  </Box>
                  <Chip
                    label={p.status}
                    size="small"
                    sx={{ bgcolor: c.bg, color: c.fg, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize', flexShrink: 0 }}
                  />
                  {p.budget_min > 0 && (
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                      ₹{p.budget_min.toLocaleString('en-IN')}
                    </Typography>
                  )}
                </Box>
              )
            })}
          </Box>
        </Paper>
      )}

      {/* Danger zone */}
      <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid #fecaca', borderRadius: '16px', p: 2.5 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
          Account
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Sign out</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25 }}>
              You will be redirected to the login page
            </Typography>
          </Box>
          <Button
            onClick={handleLogout}
            disableElevation
            sx={{ bgcolor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', textTransform: 'none', fontWeight: 600, flexShrink: 0, '&:hover': { bgcolor: '#fee2e2' } }}
          >
            Sign out
          </Button>
        </Box>
      </Paper>

    </Box>
  )
}
