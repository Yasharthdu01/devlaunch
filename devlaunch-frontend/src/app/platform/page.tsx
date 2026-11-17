'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { refreshUser, getStoredUser, can } from '@/lib/session'
import { thSx, tdSx, cardSx, ghostButtonSx, formatDate } from '@/lib/ui'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

interface Org {
  id: number; name: string; slug: string; status: 'active' | 'suspended'; created_at: string
  owner_name: string | null; owner_email: string | null; members: number; clients: number; projects: number
}
interface Stats { organizations: number; suspended: number; users: number; projects: number; new_orgs_30d: number }

export default function PlatformPage() {
  const router = useRouter()
  const [orgs, setOrgs] = useState<Org[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  async function load() {
    try {
      const [o, s] = await Promise.all([apiFetch('/api/platform/orgs'), apiFetch('/api/platform/stats')])
      if (!o.ok || !s.ok) throw new Error('Could not load platform data')
      setOrgs(await o.json())
      setStats(await s.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load platform data')
    }
  }

  useEffect(() => {
    if (!getStoredUser()) { router.replace('/login'); return }
    refreshUser().then(u => {
      if (!can(u, 'platform:orgs')) { router.replace('/dashboard'); return }
      setReady(true)
      load()
    })
  }, [router])

  async function setStatus(org: Org, status: Org['status']) {
    if (status === 'suspended' && !window.confirm(`Suspend ${org.name}? All ${org.members} members lose access immediately.`)) return
    setError('')
    const res = await apiFetch(`/api/platform/orgs/${org.id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    const data = await res.json()
    if (!res.ok) { setError(data.message); return }
    setOrgs(prev => prev.map(o => (o.id === org.id ? { ...o, status: data.status } : o)))
    load()
  }

  if (!ready) return null

  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>Platform</Typography>
      <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mb: 3 }}>Every agency on DevLaunch</Typography>

      {error && <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[
          { label: 'Agencies', value: stats?.organizations ?? 0, sub: `${stats?.new_orgs_30d ?? 0} new in 30 days`, fg: '#2563eb', bg: '#eff6ff' },
          { label: 'Users', value: stats?.users ?? 0, sub: 'across all agencies', fg: '#9333ea', bg: '#faf5ff' },
          { label: 'Projects', value: stats?.projects ?? 0, sub: 'all time', fg: '#16a34a', bg: '#f0fdf4' },
          { label: 'Suspended', value: stats?.suspended ?? 0, sub: 'agencies', fg: '#dc2626', bg: '#fef2f2' },
        ].map(m => (
          <Paper key={m.label} elevation={0} sx={{ bgcolor: m.bg, borderRadius: '12px', p: 2, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', mb: 0.5 }}>{m.label}</Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: m.fg }}>{m.value}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5 }}>{m.sub}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={thSx}>Agency</TableCell>
                <TableCell sx={thSx}>Owner</TableCell>
                <TableCell sx={thSx} align="right">Members</TableCell>
                <TableCell sx={thSx} align="right">Clients</TableCell>
                <TableCell sx={thSx} align="right">Projects</TableCell>
                <TableCell sx={thSx}>Created</TableCell>
                <TableCell sx={thSx}>Status</TableCell>
                <TableCell sx={thSx} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {orgs.map(o => (
                <TableRow key={o.id}>
                  <TableCell sx={tdSx}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{o.name}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.slug}</Typography>
                  </TableCell>
                  <TableCell sx={tdSx}>
                    <Typography sx={{ fontSize: '0.875rem' }}>{o.owner_name || '—'}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.owner_email || ''}</Typography>
                  </TableCell>
                  <TableCell sx={tdSx} align="right">{o.members}</TableCell>
                  <TableCell sx={tdSx} align="right">{o.clients}</TableCell>
                  <TableCell sx={tdSx} align="right">{o.projects}</TableCell>
                  <TableCell sx={tdSx}>{formatDate(o.created_at)}</TableCell>
                  <TableCell sx={tdSx}>
                    <Chip size="small" label={o.status === 'active' ? 'Active' : 'Suspended'}
                      sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: o.status === 'active' ? '#dcfce7' : '#fee2e2', color: o.status === 'active' ? '#15803d' : '#b91c1c' }} />
                  </TableCell>
                  <TableCell sx={tdSx} align="right">
                    {o.slug !== 'devlaunch' && (
                      <Button size="small" sx={{ ...ghostButtonSx, color: o.status === 'active' ? '#b91c1c' : '#15803d' }}
                        onClick={() => setStatus(o, o.status === 'active' ? 'suspended' : 'active')}>
                        {o.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
