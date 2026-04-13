'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Briefcase, Star, Rocket, BarChart2, FileText,
  Users, Cloud, MessageSquare, Zap, Radio, HelpCircle, Settings
} from 'lucide-react'

const navItems = [
  {
    section: 'Discover',
    links: [
      { label: 'Home',          href: '/',          icon: Home },
      { label: 'Portfolio',     href: '/portfolio', icon: Briefcase },
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
      { label: 'AI assistant',  href: '/chatbot',   icon: MessageSquare },
      { label: 'Build my MVP',  href: '/mvp',       icon: Zap },
      { label: 'Marketing AI',  href: '/marketing', icon: Radio },
      { label: 'Support',       href: '/support',   icon: HelpCircle },
      { label: 'Admin panel',   href: '/admin',     icon: Settings },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-48 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">

      {/* Logo */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="text-sm font-bold text-blue-600 tracking-tight">DevLaunch</div>
        <div className="text-[10px] text-gray-400 mt-0.5">AI delivery platform</div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2">
        {navItems.map((section) => (
          <div key={section.section} className="mb-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">
              {section.section}
            </div>
            {section.links.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-[12px] border-l-2 transition-all
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-blue-500 font-semibold'
                      : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700'
                    }`}
                >
                  <Icon size={13} className="flex-shrink-0" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
          TJ
        </div>
        <div>
          <div className="text-[11px] font-semibold text-gray-800">Traveler Co.</div>
          <div className="text-[10px] text-gray-400">Client</div>
        </div>
      </div>

    </div>
  )
}