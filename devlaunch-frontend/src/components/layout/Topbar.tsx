'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import ThemeToggle from '@/components/ui/ThemeToggle'

const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/dashboard':  { title: 'Dashboard',           sub: 'Your AI-powered delivery platform'    },
  '/':           { title: 'Welcome back',       sub: 'Your AI-powered delivery platform'    },
  '/portfolio':  { title: 'Portfolio',           sub: 'End-to-end projects delivered'        },
  '/reviews':    { title: 'Client reviews',      sub: 'Real feedback from our clients'       },
  '/wizard':     { title: 'Start project',       sub: '6-step AI-guided onboarding'          },
  '/tracker':    { title: 'Live tracker',        sub: 'Track your project progress'          },
  '/proposal':   { title: 'Project proposal',    sub: 'AI-generated scope and cost'          },
  '/collab':     { title: 'Collaboration',       sub: 'Tasks, comments and files'            },
  '/deploy':     { title: 'Deployment',          sub: 'Deploy to production'                 },
  '/chatbot':    { title: 'AI assistant',        sub: 'Powered by Ollama LLM'                },
  '/mvp':        { title: 'Build my MVP',        sub: 'Idea to full spec in seconds'         },
  '/marketing':  { title: 'Marketing AI',        sub: 'SEO, social posts and ad copy'        },
  '/support':    { title: 'Support & tickets',   sub: 'Bug reports and maintenance'          },
  '/admin':      { title: 'Admin panel',         sub: 'Manage clients, projects and revenue' },
  '/profile':    { title: 'My profile',          sub: 'Account details and settings'         },
}

export default function Topbar() {
  const pathname = usePathname()
  const meta = PAGE_META[pathname] || {
    title: 'DevLaunch',
    sub: 'AI delivery platform',
  }

  return (
    <Box
      sx={{
        bgcolor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        px: 2.5,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {meta.title}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25 }}>
          {meta.sub}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label="● Live"
          size="small"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            bgcolor: 'var(--blue-light)',
            color: 'var(--blue)',
            borderRadius: '9999px',
          }}
        />

        <ThemeToggle />

        <Box
          component={Link}
          href="/chatbot"
          sx={{
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.75,
            borderRadius: '8px',
            border: '1px solid var(--border)',
            bgcolor: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'var(--bg-tertiary)' },
          }}
        >
          Ask AI
        </Box>

        <Box
          component={Link}
          href="/wizard"
          sx={{
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.75,
            borderRadius: '8px',
            bgcolor: 'var(--blue)',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Start project
        </Box>

        <Box
          component={Link}
          href="/profile"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            cursor: 'pointer',
            bgcolor: 'var(--blue-light)',
            color: 'var(--blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          TJ
        </Box>
      </Box>
    </Box>
  )
}
