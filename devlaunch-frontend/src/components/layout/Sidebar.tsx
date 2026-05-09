'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Folder, Star, Rocket, BarChart2, FileText,
  Users, Cloud, Bot, Zap, Megaphone, LayoutGrid, Settings
} from 'lucide-react'

const navItems = [
  {
    section: 'Discover',
    links: [
      { label: 'Home',          href: '/',          icon: Home },
      { label: 'Portfolio',     href: '/portfolio', icon: Folder },
      { label: 'Reviews',       href: '/reviews',   icon: Star },
    ]
  },
  {
    section: 'My Project',
    links: [
      { label: 'Start project',  href: '/wizard',    icon: Rocket },
      { label: 'Live tracker',   href: '/tracker',   icon: BarChart2 },
      { label: 'Proposal',       href: '/proposal',  icon: FileText },
      { label: 'Collaboration',  href: '/collab',    icon: Users },
      { label: 'Deployment',     href: '/deploy',    icon: Cloud },
    ]
  },
  {
    section: 'Tools',
    links: [
      { label: 'AI assistant',  href: '/chatbot',   icon: Bot },
      { label: 'Build my MVP',  href: '/mvp',       icon: Zap },
      { label: 'Marketing AI',  href: '/marketing', icon: Megaphone },
      { label: 'Support',       href: '/support',   icon: LayoutGrid },
      { label: 'Admin panel',   href: '/admin',     icon: Settings },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col overflow-hidden justify-center">

      {/* Logo */}
      <div className="px-8 py-10">
        <div className="text-2xl font-bold text-blue-600 tracking-tight">DevLaunch</div>
        <div className="text-sm text-gray-400 mt-1.5 font-medium">AI delivery platform</div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-4">
        {navItems.map((section) => (
          <div key={section.section} className="mb-8">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">
              {section.section}
            </div>
            <div className="space-y-1.5">
              {section.links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-4 px-4 py-3 text-[14px] rounded-2xl transition-all group relative
                      ${isActive
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                      }`}
                  >
                    <Icon 
                      size={20} 
                      className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    />
                    {link.label}
                    {isActive && (
                      <div className="absolute left-0 w-1.5 h-6 bg-blue-600 rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>


      {/* User footer */}
      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            TJ
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">Traveler Co.</div>
            <div className="text-xs text-gray-500">Client</div>
          </div>
        </div>
      </div>

    </div>
  )
}
