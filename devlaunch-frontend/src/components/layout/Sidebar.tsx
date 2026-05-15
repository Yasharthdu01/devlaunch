'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Folder, Star, Rocket, BarChart2, FileText,
  Users, Cloud, Bot, Zap, Megaphone, LayoutGrid,
  Settings, User, Ticket
} from 'lucide-react'

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
    <div className="
      w-64 flex-shrink-0 flex flex-col overflow-hidden
      bg-[var(--sidebar-bg)]
      border-r border-[var(--border)]
    ">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <div className="text-xl font-bold text-[var(--blue)] tracking-tight">
          DevLaunch
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-1 font-medium">
          AI delivery platform
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-3">
        {navItems.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="
              text-xs font-bold uppercase tracking-widest px-3 mb-2
              text-[var(--text-muted)]
            ">
              {section.section}
            </div>
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 text-sm
                      rounded-xl transition-all relative group
                      ${isActive
                        ? 'bg-[var(--blue-light)] text-[var(--blue)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] font-medium'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 w-1 h-5 bg-[var(--blue)] rounded-r-full" />
                    )}
                    <Icon
                      size={17}
                      className={`flex-shrink-0 ${
                        isActive
                          ? 'text-[var(--blue)]'
                          : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                      }`}
                    />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-[var(--border)]">
        <div className="
          bg-[var(--bg-tertiary)]
          rounded-xl p-3 flex items-center gap-3
        ">
          <div className="
            w-8 h-8 rounded-full flex-shrink-0
            bg-[var(--blue)]
            text-white text-xs font-bold
            flex items-center justify-center
          ">
            TJ
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
              Traveler Co.
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Client
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}