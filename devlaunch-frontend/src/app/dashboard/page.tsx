'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Rocket, BarChart2, FileText, Bot, ArrowRight, User, CheckCircle } from 'lucide-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import LinearProgress from '@mui/material/LinearProgress'

const QUICK_ACTIONS = [
  { icon: Rocket,    label: 'Start project',  href: '/wizard',   desc: 'AI-guided onboarding', color: '#3b82f6' },
  { icon: BarChart2, label: 'Live tracker',   href: '/tracker',  desc: 'Track progress',       color: '#22c55e' },
  { icon: FileText,  label: 'View proposal',  href: '/proposal', desc: 'Scope & cost',         color: '#a855f7' },
  { icon: Bot,       label: 'AI assistant',   href: '/chatbot',  desc: 'Get help',             color: '#f97316' },
]

const STAGES = [
  { label: 'Requirements gathering', value: 100, done: true,  color: '#22c55e' },
  { label: 'Design & prototype',     value: 0,   done: false, color: 'var(--blue)' },
  { label: 'Development',            value: 0,   done: false, color: 'var(--blue)' },
]

const RESOURCES = [
  { href: '/portfolio', emoji: '📂', label: 'Portfolio',  desc: 'See our past projects', bg: '#dbeafe', fg: '#2563eb' },
  { href: '/reviews',   emoji: '⭐', label: 'Reviews',    desc: 'What clients say',       bg: '#dcfce7', fg: '#16a34a' },
  { href: '/profile',   emoji: '👤', label: 'My profile', desc: 'Account settings',       bg: '#f3e8ff', fg: '#9333ea' },
  { href: '/support',   emoji: '🎫', label: 'Support',    desc: 'Get help & tickets',     bg: '#ffedd5', fg: '#ea580c' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<{ name?: string; company_name?: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  const labelSx = { fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' } as const

  return (
    <Box sx={{ maxWidth: 880, mx: 'auto', width: '100%' }}>

      {/* Greeting */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.5 }}>
          {user?.company_name ? `${user.company_name} · ` : ''}Your AI-powered delivery platform
        </Typography>
      </Box>

      {/* Quick actions */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <Paper
              key={a.href}
              component={Link}
              href={a.href}
              elevation={0}
              sx={{
                display: 'block',
                textDecoration: 'none',
                bgcolor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                p: 2.5,
                height: '100%',
                transition: 'all 0.15s',
                '&:hover': { borderColor: 'var(--blue)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                '&:hover .qa-label': { color: 'var(--blue)' },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: a.color,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Icon size={18} color="#fff" />
              </Box>
              <Typography className="qa-label" sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', transition: 'color 0.15s' }}>
                {a.label}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5 }}>{a.desc}</Typography>
            </Paper>
          )
        })}
      </Box>

      {/* Project status summary */}
      <Paper
        elevation={0}
        sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 3, mb: 2.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Typography sx={labelSx}>Project status</Typography>
          <Typography
            component={Link}
            href="/tracker"
            sx={{
              fontSize: '0.75rem',
              color: 'var(--blue)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View details <ArrowRight size={12} />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {STAGES.map((s) => (
            <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {s.done ? (
                <CheckCircle size={16} color="#22c55e" style={{ flexShrink: 0 }} />
              ) : (
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--border)', flexShrink: 0 }} />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '0.75rem' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 500 }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.value}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={s.value}
                  sx={{
                    mt: 0.5,
                    height: 6,
                    borderRadius: '9999px',
                    bgcolor: 'var(--bg-tertiary)',
                    '& .MuiLinearProgress-bar': { bgcolor: s.color, borderRadius: '9999px' },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Resources */}
      <Paper
        elevation={0}
        sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 3 }}
      >
        <Typography sx={{ ...labelSx, mb: 2 }}>Quick resources</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' },
            gap: 1.5,
          }}
        >
          {RESOURCES.map((r) => (
            <Box
              key={r.href}
              component={Link}
              href={r.href}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'background-color 0.15s',
                '&:hover': { bgcolor: 'var(--bg-tertiary)' },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: r.bg,
                  color: r.fg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {r.emoji}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.label}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
