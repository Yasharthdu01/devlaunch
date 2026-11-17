'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { getStoredUser, refreshUser, can, ROLE_LABELS, type SessionUser, type OrgRole } from '@/lib/session'
import { thSx, tdSx, cardSx, primaryButtonSx, ghostButtonSx, tabsSx, labelSx, formatDate, formatDateTime } from '@/lib/ui'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Copy, Trash2, MessageCircle } from 'lucide-react'

interface Member { id: number; name: string; email: string; company_name: string | null; role: OrgRole; joined_at: string }
interface Invitation { id: number; email: string; role: OrgRole; expires_at: string; created_at: string; invited_by: string | null }
interface AuditEntry { id: number; action: string; entity_type: string | null; entity_id: string | null; metadata: Record<string, unknown>; created_at: string; actor_name: string | null }

const ROLE_HELP: Record<OrgRole, string> = {
  org_admin: 'Everything: team, pricing, proposals, all projects',
  developer: 'All projects and tasks; no team or billing access',
  client: 'Only their own projects; can comment and raise tickets',
}

const ACTION_LABELS: Record<string, string> = {
  'user.registered': 'joined the platform',
  'member.invited': 'invited',
  'member.joined': 'joined the team',
  'member.role_changed': 'changed a role',
  'member.removed': 'removed a member',
  'member.invitation_revoked': 'revoked an invitation',
  'project.status_changed': 'moved a project',
  'project.updated': 'updated a project',
  'proposal.generated': 'generated a proposal',
  'task.deleted': 'deleted a task',
  'milestone.status_changed': 'updated a milestone',
  'milestone.deleted': 'deleted a milestone',
  'org.created': 'created the organization',
  'org.suspended': 'suspended the organization',
  'org.reactivated': 'reactivated the organization',
}

function describe(entry: AuditEntry) {
  const m = entry.metadata || {}
  const bits: string[] = []
  if (typeof m.email === 'string') bits.push(m.email)
  if (typeof m.role === 'string') bits.push(ROLE_LABELS[m.role] || m.role)
  if (typeof m.from === 'string' && typeof m.to === 'string') bits.push(`${ROLE_LABELS[m.from] || m.from} → ${ROLE_LABELS[m.to] || m.to}`)
  if (typeof m.title === 'string') bits.push(`“${m.title}”`)
  return bits.join(' · ')
}

export default function TeamPage() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [tab, setTab] = useState('members')
  const [members, setMembers] = useState<Member[]>([])
  const [invites, setInvites] = useState<Invitation[]>([])
  const [audit, setAudit] = useState<AuditEntry[]>([])
  const [auditNext, setAuditNext] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [inviteForm, setInviteForm] = useState<{ email: string; role: OrgRole }>({ email: '', role: 'client' })
  const [lastLink, setLastLink] = useState<{ email: string; url: string; emailSent: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  const manage = can(user, 'members:manage')

  const load = useCallback(async (u: SessionUser | null) => {
    setError('')
    try {
      const res = await apiFetch('/api/orgs/current/members')
      if (!res.ok) throw new Error((await res.json()).message)
      setMembers(await res.json())
      if (can(u, 'members:manage')) {
        const inv = await apiFetch('/api/orgs/current/invitations')
        if (inv.ok) setInvites(await inv.json())
      }
      if (can(u, 'audit:read')) {
        const a = await apiFetch('/api/orgs/current/audit-log?limit=50')
        if (a.ok) {
          const data = await a.json()
          setAudit(data.entries)
          setAuditNext(data.next_before)
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your team')
    }
  }, [])

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored) { router.replace('/login'); return }
    setUser(stored)
    refreshUser().then(u => {
      if (!u || !can(u, 'members:read')) { router.replace('/dashboard'); return }
      setUser(u)
      load(u)
    })
  }, [router, load])

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(''); setNotice('')
    try {
      const res = await apiFetch('/api/orgs/current/invitations', { method: 'POST', body: JSON.stringify(inviteForm) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Could not send the invitation')
      setLastLink({ email: inviteForm.email, url: data.invite_url, emailSent: data.email_sent })
      setInviteForm({ email: '', role: inviteForm.role })
      load(user)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the invitation')
    }
    setBusy(false)
  }

  async function changeRole(member: Member, role: OrgRole) {
    setError(''); setNotice('')
    const res = await apiFetch(`/api/orgs/current/members/${member.id}`, { method: 'PATCH', body: JSON.stringify({ role }) })
    const data = await res.json()
    if (!res.ok) { setError(data.message); return }
    setNotice(`${member.name} is now ${ROLE_LABELS[role].toLowerCase()}.`)
    load(user)
  }

  async function removeMember(member: Member) {
    if (!window.confirm(`Remove ${member.name} from ${user?.org?.name}? They lose access immediately.`)) return
    setError(''); setNotice('')
    const res = await apiFetch(`/api/orgs/current/members/${member.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setError(data.message); return }
    setNotice(`${member.name} was removed.`)
    load(user)
  }

  async function revokeInvite(inv: Invitation) {
    const res = await apiFetch(`/api/orgs/current/invitations/${inv.id}`, { method: 'DELETE' })
    if (res.ok) load(user)
  }

  async function loadMoreAudit() {
    if (!auditNext) return
    const res = await apiFetch(`/api/orgs/current/audit-log?limit=50&before=${auditNext}`)
    if (res.ok) {
      const data = await res.json()
      setAudit(prev => [...prev, ...data.entries])
      setAuditNext(data.next_before)
    }
  }

  if (!user) return null
  const counts = { org_admin: 0, developer: 0, client: 0 } as Record<OrgRole, number>
  members.forEach(m => { counts[m.role]++ })

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.org?.name || 'Your team'}</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {counts.org_admin} admin{counts.org_admin === 1 ? '' : 's'} · {counts.developer} developer{counts.developer === 1 ? '' : 's'} · {counts.client} client{counts.client === 1 ? '' : 's'}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ borderRadius: '12px', mb: 2 }} onClose={() => setNotice('')}>{notice}</Alert>}

      {manage && (
        <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
          <Typography sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 2 }}>Invite someone</Typography>
          <Box component="form" onSubmit={sendInvite} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr auto' }, gap: 2, alignItems: 'end' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={labelSx}>Email</Typography>
              <TextField type="email" required size="small" fullWidth placeholder="name@company.com"
                value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={labelSx}>Role</Typography>
              <TextField select size="small" fullWidth value={inviteForm.role}
                onChange={e => setInviteForm({ ...inviteForm, role: e.target.value as OrgRole })}>
                {(['client', 'developer', 'org_admin'] as OrgRole[]).map(r => <MenuItem key={r} value={r}>{ROLE_LABELS[r]}</MenuItem>)}
              </TextField>
            </Box>
            <Button type="submit" variant="contained" disableElevation disabled={busy} sx={{ ...primaryButtonSx, py: 1 }}>
              {busy ? 'Sending…' : 'Send invite'}
            </Button>
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 1 }}>{ROLE_HELP[inviteForm.role]}</Typography>

          {lastLink && (
            <Alert severity={lastLink.emailSent ? 'success' : 'info'} sx={{ borderRadius: '12px', mt: 2, '& .MuiAlert-message': { minWidth: 0, flex: 1 } }}>
              <Typography sx={{ fontSize: '0.875rem', mb: 1 }}>
                {lastLink.emailSent ? `Invitation emailed to ${lastLink.email}.` : `Email isn’t set up, so share this link with ${lastLink.email}:`} The link works once and expires in 7 days.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box component="code" sx={{ fontSize: '0.75rem', bgcolor: 'var(--bg-tertiary)', px: 1, py: 0.5, borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', flex: '1 1 200px' }}>
                  {lastLink.url}
                </Box>
                <Button size="small" startIcon={<Copy size={14} />} sx={ghostButtonSx}
                  onClick={() => { navigator.clipboard?.writeText(lastLink.url); setNotice('Invite link copied.') }}>Copy</Button>
                <Button size="small" startIcon={<MessageCircle size={14} />} sx={ghostButtonSx} component="a" target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/?text=${encodeURIComponent(`You're invited to join ${user.org?.name} on DevLaunch: ${lastLink.url}`)}`}>
                  WhatsApp
                </Button>
              </Box>
            </Alert>
          )}
        </Paper>
      )}

      <Box sx={{ mb: 2.5 }}>
        <Tabs value={tab} onChange={(_e, v: string) => setTab(v)} sx={tabsSx}>
          <Tab value="members" label={`Members (${members.length})`} />
          {manage && <Tab value="invites" label={`Pending invites${invites.length ? ` (${invites.length})` : ''}`} />}
          {can(user, 'audit:read') && <Tab value="audit" label="Activity log" />}
        </Tabs>
      </Box>

      {tab === 'members' && (
        <Paper elevation={0} sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={thSx}>Name</TableCell>
                  <TableCell sx={thSx}>Role</TableCell>
                  <TableCell sx={thSx}>Joined</TableCell>
                  {manage && <TableCell sx={thSx} align="right" />}
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map(m => (
                  <TableRow key={m.id}>
                    <TableCell sx={tdSx}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {m.name}{m.id === user.id ? ' (you)' : ''}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.email}</Typography>
                    </TableCell>
                    <TableCell sx={tdSx}>
                      {manage ? (
                        <TextField select size="small" value={m.role} onChange={e => changeRole(m, e.target.value as OrgRole)}
                          sx={{ minWidth: 130, '& .MuiSelect-select': { py: 0.5, fontSize: '0.8rem' } }}>
                          {(['org_admin', 'developer', 'client'] as OrgRole[]).map(r => <MenuItem key={r} value={r}>{ROLE_LABELS[r]}</MenuItem>)}
                        </TextField>
                      ) : ROLE_LABELS[m.role]}
                    </TableCell>
                    <TableCell sx={tdSx}>{formatDate(m.joined_at)}</TableCell>
                    {manage && (
                      <TableCell sx={tdSx} align="right">
                        <Tooltip title="Remove from team">
                          <IconButton size="small" onClick={() => removeMember(m)} aria-label={`Remove ${m.name}`}><Trash2 size={16} /></IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tab === 'invites' && manage && (
        <Paper elevation={0} sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
          {invites.length === 0 ? (
            <Typography sx={{ p: 3, fontSize: '0.875rem', color: 'var(--text-muted)' }}>No pending invitations.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={thSx}>Email</TableCell>
                    <TableCell sx={thSx}>Role</TableCell>
                    <TableCell sx={thSx}>Invited by</TableCell>
                    <TableCell sx={thSx}>Expires</TableCell>
                    <TableCell sx={thSx} align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invites.map(i => (
                    <TableRow key={i.id}>
                      <TableCell sx={tdSx}>{i.email}</TableCell>
                      <TableCell sx={tdSx}>{ROLE_LABELS[i.role]}</TableCell>
                      <TableCell sx={tdSx}>{i.invited_by || '—'}</TableCell>
                      <TableCell sx={tdSx}>{formatDate(i.expires_at)}</TableCell>
                      <TableCell sx={tdSx} align="right">
                        <Button size="small" sx={ghostButtonSx} onClick={() => revokeInvite(i)}>Revoke</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {tab === 'audit' && (
        <Paper elevation={0} sx={cardSx}>
          {audit.length === 0 && <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No activity yet.</Typography>}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {audit.map(a => (
              <Box key={a.id} sx={{ display: 'flex', gap: 2, py: 1.25, borderBottom: '1px solid var(--border-light)', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 120, flexShrink: 0 }}>{formatDateTime(a.created_at)}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', minWidth: 0, flex: 1 }}>
                  <b>{a.actor_name || 'System'}</b> {ACTION_LABELS[a.action] || a.action}
                  {describe(a) && <Box component="span" sx={{ color: 'var(--text-muted)' }}> · {describe(a)}</Box>}
                </Typography>
              </Box>
            ))}
          </Box>
          {auditNext && <Button size="small" sx={{ ...ghostButtonSx, mt: 1.5 }} onClick={loadMoreAudit}>Load older</Button>}
        </Paper>
      )}
    </Box>
  )
}
