'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Folder, Star, Rocket, BarChart2, FileText,
  Users, Bot, Zap, Megaphone,
  Settings, User, Ticket, UserPlus, Globe, ListChecks, X
} from 'lucide-react'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { getStoredUser, refreshUser, can, ROLE_LABELS, type SessionUser } from '@/lib/session'

// Older marketing tools, hidden from the app nav unless explicitly enabled.
const SHOW_LEGACY_TOOLS = process.env.NEXT_PUBLIC_SHOW_LEGACY_TOOLS === 'true'

type NavLink = {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number }>
  // Show only if the user has this permission (or, for 'platform', is a super admin).
  needs?: string
  // Hide for agency staff (client-only pages).
  clientOnly?: boolean
  // Hide for clients (staff-only pages).
  staffOnly?: boolean
  legacy?: boolean
}

const navItems: { section: string; links: NavLink[] }[] = [
  {
    section: 'Overview',
    links: [
      { label: 'Home',      href: '/dashboard', icon: Home },
      { label: 'Portfolio', href: '/portfolio', icon: Folder, legacy: true },
      { label: 'Reviews',   href: '/reviews',   icon: Star,   legacy: true },
    ]
  },
  {
    section: 'Projects',
    links: [
      { label: 'Start project', href: '/wizard',   icon: Rocket,     needs: 'projects:create' },
      { label: 'Live tracker',  href: '/tracker',  icon: BarChart2 },
      { label: 'Proposal',      href: '/proposal', icon: FileText,   needs: 'proposals:generate' },
      { label: 'Tasks',         href: '/collab',   icon: ListChecks, staffOnly: true },
      { label: 'Collaboration', href: '/collab',   icon: Users,      clientOnly: true },
      { label: 'Support',       href: '/support',  icon: Ticket },
    ]
  },
  {
    section: 'Tools',
    links: [
      { label: 'AI assistant', href: '/chatbot',   icon: Bot },
      { label: 'Build my MVP', href: '/mvp',       icon: Zap,       clientOnly: true },
      { label: 'Marketing AI', href: '/marketing', icon: Megaphone, legacy: true },
    ]
  },
  {
    section: 'Manage',
    links: [
      { label: 'Admin panel', href: '/admin',    icon: Settings, needs: 'stats:read' },
      { label: 'Team',        href: '/team',     icon: UserPlus, needs: 'members:read' },
      { label: 'Platform',    href: '/platform', icon: Globe,    needs: 'platform:orgs' },
      { label: 'My profile',  href: '/profile',  icon: User },
    ]
  },
]

function visible(link: NavLink, user: SessionUser | null) {
  if (link.legacy && !SHOW_LEGACY_TOOLS) return false
  const staff = can(user, 'projects:read_all')
  if (link.clientOnly && staff) return false
  if (link.staffOnly && !staff) return false
  if (link.needs && !can(user, link.needs)) return false
  return true
}

// onClose: shown as a close button when the sidebar is a mobile drawer.
// onNavigate: called after a link is tapped (closes the drawer).
export default function Sidebar({ onClose, onNavigate }: { onClose?: () => void; onNavigate?: () => void } = {}) {
  const pathname = usePathname()
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
    // Pick up role changes made by an admin since this user logged in.
    refreshUser().then(u => u && setUser(u))
    const onChange = () => setUser(getStoredUser())
    window.addEventListener('session-changed', onChange)
    return () => window.removeEventListener('session-changed', onChange)
  }, [])

  const initials = (user?.name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Box
      sx={{
        width: 256,
        maxWidth: '85vw',
        height: '100%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid var(--border)', position: 'relative' }}>
        {onClose && (
          <IconButton
            onClick={onClose}
            aria-label="Close menu"
            size="small"
            sx={{ position: 'absolute', top: 16, right: 12, color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </IconButton>
        )}
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--blue)', letterSpacing: '-0.02em' }}>
          DevLaunch
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.org?.name || 'AI delivery platform'}
        </Typography>
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5, px: 1.5 }}>
        {navItems.map((section) => ({ ...section, links: section.links.filter(l => visible(l, user)) }))
          .filter(section => section.links.length > 0)
          .map((section) => (
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
                    key={link.label}
                    component={Link}
                    href={link.href}
                    onClick={onNavigate}
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
            {initials}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.company_name || user?.name || 'Guest'}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.is_super_admin ? 'Platform admin' : ROLE_LABELS[user?.org_role || ''] || 'Client'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
