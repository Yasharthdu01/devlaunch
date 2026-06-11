'use client'
import { useState, useEffect } from 'react'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

interface Ticket {
  id:          number
  title:       string
  description: string
  type:        string
  status:      string
  priority:    string
  created_at:  string
}

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  open:        { bg: '#dbeafe', fg: '#1d4ed8' },
  in_progress: { bg: '#fef3c7', fg: '#b45309' },
  resolved:    { bg: '#dcfce7', fg: '#15803d' },
  closed:      { bg: '#f3f4f6', fg: '#6b7280' },
}

const PRIORITY_COLORS: Record<string, { bg: string; fg: string }> = {
  low:      { bg: '#f3f4f6', fg: '#6b7280' },
  medium:   { bg: '#fef3c7', fg: '#b45309' },
  high:     { bg: '#fee2e2', fg: '#b91c1c' },
  critical: { bg: '#fecaca', fg: '#991b1b' },
}

const TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  bug:     { bg: '#fee2e2', fg: '#b91c1c' },
  feature: { bg: '#dbeafe', fg: '#1d4ed8' },
  support: { bg: '#f3e8ff', fg: '#7e22ce' },
  other:   { bg: '#f3f4f6', fg: '#4b5563' },
}

const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' } as const

const MAINTENANCE_PLANS = [
  { name: 'Basic',    desc: 'Bug fixes only',                price: '₹5,000/mo',  color: 'var(--border)' },
  { name: 'Standard', desc: 'Bugs + minor features',         price: '₹12,000/mo', color: '#93c5fd' },
  { name: 'Premium',  desc: 'Dedicated dev hours (40hrs/mo)', price: '₹25,000/mo', color: '#d8b4fe' },
]

export default function SupportPage() {
  const [tickets,   setTickets]   = useState<Ticket[]>([])
  const [showForm,  setShowForm]  = useState(false)
  const [loading,   setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title:       '',
    description: '',
    type:        'bug',
    priority:    'medium',
  })

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  useEffect(() => { fetchTickets() }, [])

  async function fetchTickets() {
    setLoading(true)
    try {
      const res = await fetch(API_URL + '/api/support', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : [])
    } catch {}
    setLoading(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submitTicket() {
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(API_URL + '/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setTickets(prev => [data, ...prev])
      setForm({ title: '', description: '', type: 'bug', priority: 'medium' })
      setShowForm(false)
    } catch {}
    setSubmitting(false)
  }

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch(API_URL + `/api/support/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      setTickets(prev => prev.map(t => t.id === id ? data : t))
    } catch {}
  }

  async function deleteTicket(id: number) {
    try {
      await fetch(API_URL + `/api/support/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setTickets(prev => prev.filter(t => t.id !== id))
    } catch {}
  }

  const open     = tickets.filter(t => t.status === 'open').length
  const progress = tickets.filter(t => t.status === 'in_progress').length
  const resolved = tickets.filter(t => t.status === 'resolved').length

  return (
    <Box sx={{ maxWidth: 768, mx: 'auto', width: '100%' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h1" sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Support & tickets
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.25 }}>
            Bug reports, feature requests and maintenance
          </Typography>
        </Box>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="contained"
          disableElevation
          sx={{
            px: 2,
            bgcolor: 'var(--blue)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderRadius: '8px',
            textTransform: 'none',
            flexShrink: 0,
            '&:hover': { bgcolor: 'var(--blue-dark)' },
          }}
        >
          + New ticket
        </Button>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
        {[
          { label: 'Open',        value: open,     fg: '#2563eb', bg: '#eff6ff' },
          { label: 'In progress', value: progress, fg: '#d97706', bg: '#fffbeb' },
          { label: 'Resolved',    value: resolved, fg: '#16a34a', bg: '#f0fdf4' },
        ].map(s => (
          <Paper key={s.label} elevation={0} sx={{ bgcolor: s.bg, borderRadius: '12px', p: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: s.fg }}>{s.value}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5 }}>{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* New ticket form */}
      {showForm && (
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--blue)', borderRadius: '16px', p: 2.5, mb: 2.5 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', mb: 2 }}>Create new ticket</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="Title *"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief description of the issue..."
              size="small"
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              multiline
              rows={3}
              size="small"
              fullWidth
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField select label="Type" name="type" value={form.type} onChange={handleChange} size="small" fullWidth>
                <MenuItem value="bug">Bug</MenuItem>
                <MenuItem value="feature">Feature request</MenuItem>
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
              <TextField select label="Priority" name="priority" value={form.priority} onChange={handleChange} size="small" fullWidth>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                onClick={submitTicket}
                disabled={submitting || !form.title.trim()}
                variant="contained"
                disableElevation
                sx={{ flex: 1, py: 1, bgcolor: 'var(--blue)', color: '#fff', fontWeight: 600, fontSize: '0.875rem', borderRadius: '8px', textTransform: 'none', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
              >
                {submitting ? 'Submitting...' : 'Submit ticket'}
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outlined"
                sx={{ px: 2, borderColor: 'var(--border)', color: 'var(--text-secondary)', fontSize: '0.875rem', borderRadius: '8px', textTransform: 'none', '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' } }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Tickets list */}
      {loading ? (
        <Box sx={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', py: 4 }}>
          Loading tickets...
        </Box>
      ) : tickets.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: '#d1d5db', fontSize: '2.25rem', mb: 1.5 }}>🎫</Typography>
          <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.875rem', mb: 0.5 }}>No tickets yet</Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Click &quot;New ticket&quot; to report a bug or request a feature
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {tickets.map(t => {
            const tc = TYPE_COLORS[t.type] || TYPE_COLORS.other
            const pc = PRIORITY_COLORS[t.priority] || PRIORITY_COLORS.medium
            const sc = STATUS_COLORS[t.status] || STATUS_COLORS.open
            return (
              <Paper key={t.id} elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', mb: 0.5 }}>
                      #{t.id} · {t.title}
                    </Typography>
                    {t.description && (
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {t.description}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    onClick={() => deleteTicket(t.id)}
                    size="small"
                    sx={{ color: '#d1d5db', flexShrink: 0, fontSize: '1.25rem', lineHeight: 1, '&:hover': { color: '#f87171' } }}
                  >
                    ×
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                  <Chip label={t.type} size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: tc.bg, color: tc.fg }} />
                  <Chip label={t.priority} size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: pc.bg, color: pc.fg }} />
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </Typography>
                    <TextField
                      select
                      value={t.status}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStatus(t.id, e.target.value)}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: '999px', bgcolor: sc.bg, color: sc.fg, fontSize: '0.7rem', fontWeight: 600 },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiSelect-select': { py: 0.5, pl: 1.5 },
                      }}
                    >
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="in_progress">In progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </TextField>
                  </Box>
                </Box>
              </Paper>
            )
          })}
        </Box>
      )}

      {/* Maintenance plans */}
      <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, mt: 3 }}>
        <Typography sx={{ ...labelSx, mb: 2 }}>Maintenance plans</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
          {MAINTENANCE_PLANS.map(plan => (
            <Box key={plan.name} sx={{ border: `2px solid ${plan.color}`, borderRadius: '12px', p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>{plan.name}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mb: 1.5 }}>{plan.desc}</Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'var(--blue)' }}>{plan.price}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

    </Box>
  )
}
