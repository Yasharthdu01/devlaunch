'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Folder, Star, Rocket, BarChart2, FileText,
  Users, Cloud, Bot, Zap, Megaphone,
  Settings, User, Ticket
} from 'lucide-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const navItems = [
  {
    section: 'Discover',
    links: [
      { label: 'Home', href: '/dashboard', icon: Home },
      { label: 'Portfolio',    href: '/portfolio', icon: Folder     },
      { label: 'Reviews',      href: '/reviews',   icon: Star       },
    ]
  },
  {
    section: 'My Project',
    links: [
      { label: 'Start project', href: '/wizard',   icon: Rocket    },
      { label: 'Live tracker',  href: '/tracker',  icon: BarChart2 },
      { label: 'Proposal',      href: '/proposal', icon: FileText  },
      { label: 'Collaboration', href: '/collab',   icon: Users     },
      { label: 'Deployment',    href: '/deploy',   icon: Cloud     },
    ]
  },
  {
    section: 'Tools',
    links: [
      { label: 'AI assistant',  href: '/chatbot',   icon: Bot        },
      { label: 'Build my MVP',  href: '/mvp',       icon: Zap        },
      { label: 'Marketing AI',  href: '/marketing', icon: Megaphone  },
      { label: 'Support',       href: '/support',   icon: Ticket     },
      { label: 'Admin panel',   href: '/admin',     icon: Settings   },
      { label: 'My profile',    href: '/profile',   icon: User       },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <Box
      sx={{
        width: 256,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid var(--border)' }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--blue)', letterSpacing: '-0.02em' }}>
          DevLaunch
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5, fontWeight: 500 }}>
          AI delivery platform
        </Typography>
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5, px: 1.5 }}>
        {navItems.map((section) => (
          <Box key={section.section} sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                px: 1.5,
                mb: 1,
                color: 'var(--text-muted)',
              }}
            >
              {section.section}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              {section.links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Box
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 1.5,
                      py: 1.25,
                      fontSize: '0.875rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--blue)' : 'var(--text-secondary)',
                      bgcolor: isActive ? 'var(--blue-light)' : 'transparent',
                      '&:hover': isActive
                        ? {}
                        : { bgcolor: 'var(--bg-tertiary)', color: 'var(--text-primary)' },
                    }}
                  >
                    {isActive && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          width: 4,
                          height: 20,
                          bgcolor: 'var(--blue)',
                          borderRadius: '0 9999px 9999px 0',
                        }}
                      />
                    )}
                    <Box component="span" sx={{ display: 'flex', flexShrink: 0, color: isActive ? 'var(--blue)' : 'var(--text-muted)' }}>
                      <Icon size={17} />
                    </Box>
                    {link.label}
                  </Box>
                )
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {/* User footer */}
      <Box sx={{ p: 1.5, borderTop: '1px solid var(--border)' }}>
        <Box sx={{ bgcolor: 'var(--bg-tertiary)', borderRadius: '12px', p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: 'var(--blue)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            TJ
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Traveler Co.
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Client
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
