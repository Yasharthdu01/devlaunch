'use client'
import { useState, useEffect } from 'react'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import LinearProgress from '@mui/material/LinearProgress'
import Link from 'next/link'

const STAGES = ['discovery', 'design', 'development', 'testing', 'deploy', 'live']

const STAGE_LABELS: Record<string, string> = {
  discovery:   'Discovery',
  design:      'Design',
  development: 'Development',
  testing:     'Testing',
  deploy:      'Deploy',
  live:        'Live',
}

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  pending:     { bg: '#e5e7eb', fg: '#4b5563' },
  in_progress: { bg: '#dbeafe', fg: '#1d4ed8' },
  done:        { bg: '#dcfce7', fg: '#15803d' },
}

function getProgress(status) {
  const idx = STAGES.indexOf(status)
  if (idx === -1) return 0
  return Math.round(((idx + 1) / STAGES.length) * 100)
}

export default function TrackerPage() {
  const [projects,   setProjects]   = useState([])
  const [selected,   setSelected]   = useState(null)
  const [milestones, setMilestones] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [newTitle,   setNewTitle]   = useState('')
  const [newDate,    setNewDate]    = useState('')
  const [adding,     setAdding]     = useState(false)

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selected) fetchMilestones(selected.id)
  }, [selected])

  async function fetchProjects() {
    setLoading(true)
    try {
      const res = await fetch(API_URL + '/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setProjects(data)
      if (data.length > 0) setSelected(data[0])
    } catch {}
    setLoading(false)
  }

  async function fetchMilestones(projectId) {
    try {
      const res = await fetch(
        API_URL + `/api/milestones/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setMilestones(data)
    } catch {}
  }

  async function updateStatus(status) {
    try {
      const res = await fetch(
        API_URL + `/api/projects/${selected.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      )
      const data = await res.json()
      setSelected(data)
      setProjects(prev =>
        prev.map(p => (p.id === data.id ? data : p))
      )
    } catch {}
  }

  async function updateMilestone(id, status) {
    try {
      await fetch(API_URL + `/api/milestones/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      setMilestones(prev =>
        prev.map(m => (m.id === id ? { ...m, status } : m))
      )
    } catch {}
  }

  async function addMilestone() {
    if (!newTitle.trim()) return
    setAdding(true)
    try {
      const res = await fetch(API_URL + '/api/milestones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: selected.id,
          title: newTitle,
          due_date: newDate || null,
        }),
      })
      const data = await res.json()
      setMilestones(prev => [...prev, data])
      setNewTitle('')
      setNewDate('')
    } catch {}
    setAdding(false)
  }

  async function deleteMilestone(id) {
    try {
      await fetch(API_URL + `/api/milestones/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setMilestones(prev => prev.filter(m => m.id !== id))
    } catch {}
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading projects...</Typography>
      </Box>
    )
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 256, gap: 1.5 }}>
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No projects yet</Typography>
        <Button
          component={Link}
          href="/wizard"
          variant="contained"
          disableElevation
          sx={{ bgcolor: 'var(--blue)', color: '#fff', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'var(--blue-dark)' } }}
        >
          Start a project →
        </Button>
      </Box>
    )
  }

  const progress = selected ? getProgress(selected.status) : 0

  const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 } as const

  return (
    <Box sx={{ width: '100%' }}>

      {/* Project selector */}
      {projects.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
          {projects.map(p => (
            <Button
              key={p.id}
              onClick={() => setSelected(p)}
              disableElevation
              variant={selected?.id === p.id ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                borderRadius: '8px',
                py: 0.5,
                ...(selected?.id === p.id
                  ? { bgcolor: 'var(--blue)', color: '#fff', '&:hover': { bgcolor: 'var(--blue-dark)' } }
                  : { borderColor: 'var(--border)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--blue-light)' } }),
              }}
            >
              {p.title}
            </Button>
          ))}
        </Box>
      )}

      {selected && (
        <Box>
          {/* Project header */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selected.title}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.25 }}>{selected.description}</Typography>
              </Box>
              <Chip
                label={selected.status}
                size="small"
                sx={{ bgcolor: 'var(--blue-light)', color: 'var(--blue)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', flexShrink: 0 }}
              />
            </Box>

            {/* Stage bar */}
            <Box sx={{ display: 'flex', alignItems: 'stretch', mb: 2, flexWrap: 'wrap' }}>
              {STAGES.map((stage, i) => {
                const isCurrent = selected.status === stage
                const isDone = STAGES.indexOf(selected.status) > i
                return (
                  <Box key={stage} sx={{ flex: 1, minWidth: 80 }}>
                    <Button
                      onClick={() => updateStatus(stage)}
                      fullWidth
                      disableElevation
                      sx={{
                        py: 0.75,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 0,
                        borderTop: '2px solid',
                        minWidth: 0,
                        ...(isCurrent
                          ? { borderTopColor: 'var(--blue)', color: 'var(--blue)' }
                          : isDone
                            ? { borderTopColor: '#22c55e', color: '#16a34a' }
                            : { borderTopColor: 'var(--border)', color: 'var(--text-muted)', '&:hover': { borderTopColor: 'var(--text-muted)' } }),
                      }}
                    >
                      {isDone ? '✓ ' : ''}
                      {STAGE_LABELS[stage]}
                    </Button>
                  </Box>
                )
              })}
            </Box>

            {/* Progress bar */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', mb: 0.75 }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall progress</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{progress}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: '9999px',
                  bgcolor: 'var(--bg-tertiary)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'var(--blue)', borderRadius: '9999px' },
                }}
              />
            </Box>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>

            {/* Milestones */}
            <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
              <Typography sx={labelSx}>Milestones</Typography>

              {milestones.length === 0 ? (
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', py: 2 }}>
                  No milestones yet
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                  {milestones.map((m, i) => {
                    const dot =
                      m.status === 'done' ? '#22c55e' :
                      m.status === 'in_progress' ? 'var(--blue)' : '#d1d5db'
                    return (
                      <Box
                        key={m.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          py: 1.25,
                          borderBottom: i === milestones.length - 1 ? 'none' : '1px solid var(--border-light)',
                        }}
                      >
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: dot, flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.title}
                          </Typography>
                          {m.due_date && (
                            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25 }}>
                              {new Date(m.due_date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </Typography>
                          )}
                        </Box>
                        <TextField
                          select
                          value={m.status}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMilestone(m.id, e.target.value)}
                          size="small"
                          sx={{
                            flexShrink: 0,
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              borderRadius: '9999px',
                              bgcolor: (STATUS_COLORS[m.status] || STATUS_COLORS.pending).bg,
                              color: (STATUS_COLORS[m.status] || STATUS_COLORS.pending).fg,
                              '& fieldset': { border: 'none' },
                            },
                            '& .MuiSelect-select': { py: 0.5, pl: 1.25 },
                          }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in_progress">In progress</MenuItem>
                          <MenuItem value="done">Done</MenuItem>
                        </TextField>
                        <Button
                          onClick={() => deleteMilestone(m.id)}
                          sx={{ minWidth: 'auto', p: 0.5, color: 'var(--text-muted)', fontSize: '1.125rem', lineHeight: 1, flexShrink: 0, '&:hover': { color: '#f87171', bgcolor: 'transparent' } }}
                        >
                          ×
                        </Button>
                      </Box>
                    )
                  })}
                </Box>
              )}

              {/* Add milestone */}
              <Box sx={{ borderTop: '1px solid var(--border)', pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                  value={newTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addMilestone()}
                  placeholder="Add new milestone..."
                  size="small"
                  fullWidth
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    type="date"
                    value={newDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDate(e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <Button
                    onClick={addMilestone}
                    disabled={adding || !newTitle.trim()}
                    variant="contained"
                    disableElevation
                    sx={{ bgcolor: 'var(--blue)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, borderRadius: '8px', textTransform: 'none', whiteSpace: 'nowrap', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
                  >
                    {adding ? '...' : '+ Add'}
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Contract & details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
                <Typography sx={{ ...labelSx, mb: 1.5 }}>Project details</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {[
                    { k: 'Project ID', v: `#${selected.id}` },
                    { k: 'Status', v: selected.status, cap: true },
                    { k: 'Budget', v: selected.budget_min ? `₹${selected.budget_min.toLocaleString('en-IN')}` : 'Not set' },
                    { k: 'Timeline', v: selected.timeline_weeks ? `${selected.timeline_weeks} weeks` : 'Not set' },
                    { k: 'Started', v: new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                  ].map(row => (
                    <Box key={row.k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{row.k}</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: row.cap ? 'capitalize' : 'none', textAlign: 'right', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.v}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
                <Typography sx={{ ...labelSx, mb: 1.5 }}>Quick actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    { href: '/proposal', label: 'View proposal', primary: false },
                    { href: '/chatbot', label: 'Ask AI assistant', primary: true },
                    { href: '/collab', label: 'Team collaboration', primary: false },
                  ].map(link => (
                    <Button
                      key={link.href}
                      component={Link}
                      href={link.href}
                      fullWidth
                      variant={link.primary ? 'contained' : 'outlined'}
                      disableElevation
                      sx={{
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderRadius: '8px',
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

          </Box>
        </Box>
      )}
    </Box>
  )
}
