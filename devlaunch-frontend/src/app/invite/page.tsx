'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { getStoredUser, saveSession, homePathFor, ROLE_LABELS, type SessionUser } from '@/lib/session'

interface InvitePreview { org_name: string; email: string; role: string; expires_at: string; has_account: boolean }

const buttonSx = {
  bgcolor: 'var(--blue)', color: '#fff', borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1,
  '&:hover': { bgcolor: 'var(--blue-dark)' },
} as const

function InviteContent() {
  const router = useRouter()
  const token = useSearchParams().get('token') || ''
  const [invite, setInvite] = useState<InvitePreview | null>(null)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
    if (!token) { setError('This invitation link is incomplete.'); setLoading(false); return }
    fetch(API_URL + `/api/invitations/${encodeURIComponent(token)}`)
      .then(async r => {
        const data = await r.json()
        if (r.ok) setInvite(data)
        else setError(data.message || 'This invitation link is invalid or has expired.')
      })
      .catch(() => setError('Could not load the invitation. Please try again.'))
      .finally(() => setLoading(false))
  }, [token])

  async function accept() {
    setAccepting(true)
    setError('')
    try {
      const res = await fetch(API_URL + `/api/invitations/${encodeURIComponent(token)}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Could not accept the invitation.'); setAccepting(false); return }
      saveSession(null, data.user)
      router.push(homePathFor(data.user))
    } catch {
      setError('Could not accept the invitation. Please try again.')
      setAccepting(false)
    }
  }

  const here = `/invite?token=${encodeURIComponent(token)}`
  const signedInAsInvitee = user && invite && user.email.toLowerCase() === invite.email.toLowerCase()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--bg-secondary)', p: 2 }}>
      <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 4, width: '100%', maxWidth: 420 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue)', textAlign: 'center', mb: 3 }}>DevLaunch</Typography>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box>}

        {error && <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>{error}</Alert>}

        {invite && (
          <>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>
              Join {invite.org_name}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', mb: 3, lineHeight: 1.6 }}>
              You’ve been invited as <b>{ROLE_LABELS[invite.role]?.toLowerCase() || invite.role}</b> using <b>{invite.email}</b>.
            </Typography>

            {signedInAsInvitee ? (
              <Button fullWidth variant="contained" disableElevation disabled={accepting} onClick={accept} sx={buttonSx}>
                {accepting ? 'Joining…' : `Accept and join ${invite.org_name}`}
              </Button>
            ) : user ? (
              <Alert severity="warning" sx={{ borderRadius: '12px' }}>
                You’re signed in as {user.email}. Log out and sign in as {invite.email} to accept.
              </Alert>
            ) : invite.has_account ? (
              <Button fullWidth variant="contained" disableElevation component={Link} href={`/login?next=${encodeURIComponent(here)}`} sx={buttonSx}>
                Log in to accept
              </Button>
            ) : (
              <Button fullWidth variant="contained" disableElevation component={Link} href={`/register?invite=${encodeURIComponent(token)}`} sx={buttonSx}>
                Create your account
              </Button>
            )}
          </>
        )}

        {!loading && !invite && (
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Ask whoever invited you to send a new link.
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default function InvitePage() {
  return (
    <Suspense fallback={null}>
      <InviteContent />
    </Suspense>
  )
}
