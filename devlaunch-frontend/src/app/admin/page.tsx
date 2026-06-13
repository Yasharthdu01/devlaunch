'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

interface RevenuePoint { month: string; revenue: string | number }
interface Client {
  id: number
  name: string
  email: string
  company_name?: string
  industry?: string
  project_count: number
  total_value?: string | number
  created_at?: string
}
interface Project {
  id: number
  title: string
  status: string
  client_name?: string
  company_name?: string
  platform?: string
  budget_min?: string | number
}
interface Stats {
  total_clients?: number
  total_projects?: number
  active_projects?: number
  total_revenue?: number
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

const STATUSES = ['discovery', 'design', 'development', 'testing', 'deploy', 'live', 'delivered']

const DEVELOPERS = [
  'Ravi Kumar',
  'Priya Mehta',
  'Amit Singh',
  'Sneha Reddy',
  'Unassigned',
]

const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 } as const
const thSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', bgcolor: 'var(--bg-tertiary)', whiteSpace: 'nowrap' } as const
const tdSx = { borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.875rem' } as const

function RevenueBar({ data }: { data: RevenuePoint[] }) {
  if (!data || data.length === 0) return (
    <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', py: 4 }}>
      No revenue data yet
    </Typography>
  )

  const max = Math.max(...data.map(d => parseInt(String(d.revenue)) || 0))

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 144, px: 1 }}>
      {data.map((d, i) => {
        const value = parseInt(String(d.revenue)) || 0
        const height = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 4
        return (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0, height: '100%', justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {value > 0 ? `₹${Math.round(value / 1000)}k` : ''}
            </Typography>
            <Box
              sx={{ width: '100%', bgcolor: 'var(--blue)', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', transition: 'all 0.2s', height: `${height}%`, '&:hover': { bgcolor: 'var(--blue-dark)' } }}
              title={`${d.month}: ₹${value.toLocaleString('en-IN')}`}
            />
            <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>
              {d.month}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [stats,    setStats]    = useState<Stats | null>(null)
  const [clients,  setClients]  = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [revenue,  setRevenue]  = useState<RevenuePoint[]>([])
  const [tab,      setTab]      = useState('overview')
  const [loading,  setLoading]  = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  useEffect(() => {
    // Client-side guard — the backend adminOnly middleware is the real enforcement.
    let role = ''
    try {
      const raw = localStorage.getItem('user')
      if (raw) role = (JSON.parse(raw).role || '')
    } catch {}
    if (role !== 'admin') {
      router.replace('/dashboard')
      return
    }
    setAuthorized(true)
    fetchAll()
  }, [router])

  async function fetchAll() {
    setLoading(true)
    try {
      const [s, c, p, r] = await Promise.all([
        fetch(API_URL +'/api/admin/stats',    { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(API_URL +'/api/admin/clients',  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(API_URL +'/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(API_URL +'/api/admin/revenue',  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ])
      setStats(s)
      setClients(Array.isArray(c) ? c : [])
      setProjects(Array.isArray(p) ? p : [])
      setRevenue(Array.isArray(r) ? r : [])
    } catch {}
    setLoading(false)
  }

  async function updateProject(id: number, field: string, value: string) {
    try {
      const res = await fetch(
        API_URL + `/api/admin/projects/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      )
      const data = await res.json()
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    } catch {}
  }

  if (!authorized) return null

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading admin panel...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>

      {/* Metric cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[
          { label: 'Total clients',   value: stats?.total_clients ?? 0,                                         change: 'registered users',   fg: '#2563eb', bg: '#eff6ff' },
          { label: 'Total projects',  value: stats?.total_projects ?? 0,                                        change: 'all time',           fg: '#9333ea', bg: '#faf5ff' },
          { label: 'Active projects', value: stats?.active_projects ?? 0,                                       change: 'in progress',        fg: '#d97706', bg: '#fffbeb' },
          { label: 'Total revenue',   value: `₹${((stats?.total_revenue ?? 0) / 100000).toFixed(1)}L`,         change: 'from all projects',  fg: '#16a34a', bg: '#f0fdf4' },
        ].map(m => (
          <Paper key={m.label} elevation={0} sx={{ bgcolor: m.bg, borderRadius: '12px', p: 2, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: m.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.value}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.change}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 2.5 }}>
        <Tabs
          value={tab}
          onChange={(_e, v: string) => setTab(v)}
          sx={{
            minHeight: 0,
            bgcolor: 'var(--bg-tertiary)',
            borderRadius: '12px',
            p: 0.5,
            display: 'inline-flex',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: 0,
              py: 0.75,
              px: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '8px',
              color: 'var(--text-muted)',
            },
            '& .Mui-selected': {
              bgcolor: 'var(--bg-primary)',
              color: 'var(--text-primary) !important',
            },
          }}
        >
          <Tab value="overview" label="Overview" />
          <Tab value="projects" label="Projects" />
          <Tab value="clients"  label="Clients" />
        </Tabs>
      </Box>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.5 }}>

          {/* Revenue chart */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, minWidth: 0 }}>
            <Typography sx={labelSx}>Revenue by month</Typography>
            <RevenueBar data={revenue} />
          </Paper>

          {/* Project status breakdown */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, minWidth: 0 }}>
            <Typography sx={labelSx}>Project pipeline</Typography>
            {STATUSES.map(status => {
              const count = projects.filter(p => p.status === status).length
              const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0
              return (
                <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Typography sx={{ width: 80, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize', flexShrink: 0 }}>{status}</Typography>
                  <Box sx={{ flex: 1, height: 8, bgcolor: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', bgcolor: 'var(--blue)', borderRadius: '999px', transition: 'all 0.3s', width: `${pct}%` }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', width: 24, textAlign: 'right', flexShrink: 0 }}>{count}</Typography>
                </Box>
              )
            })}
          </Paper>

          {/* Recent clients */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, minWidth: 0 }}>
            <Typography sx={labelSx}>Recent clients</Typography>
            {clients.slice(0, 5).map(c => (
              <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, borderBottom: '1px solid var(--border-light)', '&:last-child': { borderBottom: 'none' } }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                  {(c.name || 'U')[0].toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.company_name || c.email}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                  {c.project_count} project{c.project_count !== 1 ? 's' : ''}
                </Typography>
              </Box>
            ))}
          </Paper>

          {/* Recent projects */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, minWidth: 0 }}>
            <Typography sx={labelSx}>Recent projects</Typography>
            {projects.slice(0, 5).map(p => {
              const c = STATUS_COLORS[p.status] || STATUS_COLORS.discovery
              return (
                <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, borderBottom: '1px solid var(--border-light)', '&:last-child': { borderBottom: 'none' } }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.client_name}</Typography>
                  </Box>
                  <Chip label={p.status} size="small" sx={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize', flexShrink: 0, bgcolor: c.bg, color: c.fg }} />
                </Box>
              )
            })}
          </Paper>

        </Box>
      )}

      {/* PROJECTS TAB */}
      {tab === 'projects' && (
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Table sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={thSx}>Project</TableCell>
                  <TableCell sx={thSx}>Client</TableCell>
                  <TableCell sx={thSx}>Status</TableCell>
                  <TableCell sx={thSx}>Developer</TableCell>
                  <TableCell sx={thSx}>Budget</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map(p => {
                  const c = STATUS_COLORS[p.status] || STATUS_COLORS.discovery
                  return (
                    <TableRow key={p.id} sx={{ '&:hover': { bgcolor: 'var(--bg-tertiary)' } }}>
                      <TableCell sx={tdSx}>
                        <Typography sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{p.title}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{p.id}</Typography>
                      </TableCell>
                      <TableCell sx={tdSx}>
                        <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.client_name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.company_name}</Typography>
                      </TableCell>
                      <TableCell sx={tdSx}>
                        <TextField
                          select
                          value={p.status}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(p.id, 'status', e.target.value)}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '999px', bgcolor: c.bg, color: c.fg, fontSize: '0.7rem', fontWeight: 600 },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSelect-select': { py: 0.5, pl: 1.5, textTransform: 'capitalize' },
                          }}
                        >
                          {STATUSES.map(s => <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>)}
                        </TextField>
                      </TableCell>
                      <TableCell sx={tdSx}>
                        <TextField
                          select
                          value={p.platform || 'Unassigned'}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(p.id, 'developer', e.target.value)}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '0.75rem' },
                            '& .MuiSelect-select': { py: 0.5, pl: 1.5 },
                          }}
                        >
                          {DEVELOPERS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </TextField>
                      </TableCell>
                      <TableCell sx={{ ...tdSx, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {p.budget_min ? `₹${parseInt(String(p.budget_min)).toLocaleString('en-IN')}` : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ ...tdSx, textAlign: 'center', py: 4, color: 'var(--text-muted)' }}>
                      No projects yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* CLIENTS TAB */}
      {tab === 'clients' && (
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={thSx}>Client</TableCell>
                  <TableCell sx={thSx}>Email</TableCell>
                  <TableCell sx={thSx}>Industry</TableCell>
                  <TableCell sx={thSx}>Projects</TableCell>
                  <TableCell sx={thSx}>Total value</TableCell>
                  <TableCell sx={thSx}>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map(c => (
                  <TableRow key={c.id} sx={{ '&:hover': { bgcolor: 'var(--bg-tertiary)' } }}>
                    <TableCell sx={tdSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#dbeafe', color: '#1d4ed8', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                          {(c.name || 'U')[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.company_name}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ ...tdSx, color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.email}</TableCell>
                    <TableCell sx={tdSx}>
                      <Chip label={c.industry || 'Not set'} size="small" sx={{ fontSize: '0.7rem', bgcolor: '#f3f4f6', color: '#4b5563' }} />
                    </TableCell>
                    <TableCell sx={{ ...tdSx, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>
                      {c.project_count}
                    </TableCell>
                    <TableCell sx={{ ...tdSx, fontWeight: 600, color: '#15803d', whiteSpace: 'nowrap' }}>
                      {parseInt(String(c.total_value)) > 0 ? `₹${parseInt(String(c.total_value)).toLocaleString('en-IN')}` : '—'}
                    </TableCell>
                    <TableCell sx={{ ...tdSx, fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ ...tdSx, textAlign: 'center', py: 4, color: 'var(--text-muted)' }}>
                      No clients yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

    </Box>
  )
}
