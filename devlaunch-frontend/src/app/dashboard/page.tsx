'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Rocket, BarChart2, FileText, Bot, ArrowRight, User, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<{ name?: string; company_name?: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  const quickActions = [
    { icon: Rocket, label: 'Start project', href: '/wizard', desc: 'AI-guided onboarding', color: 'bg-blue-500' },
    { icon: BarChart2, label: 'Live tracker', href: '/tracker', desc: 'Track progress', color: 'bg-green-500' },
    { icon: FileText, label: 'View proposal', href: '/proposal', desc: 'Scope & cost', color: 'bg-purple-500' },
    { icon: Bot, label: 'AI assistant', href: '/chatbot', desc: 'Get help', color: 'bg-orange-500' },
  ]

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {user?.company_name ? `${user.company_name} · ` : ''}Your AI-powered delivery platform
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((a) => {
          const Icon = a.icon
          return (
            <Link key={a.href} href={a.href}>
              <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--blue)] hover:shadow-md transition-all cursor-pointer group h-full">
                <div className={`w-10 h-10 ${a.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--blue)] transition-colors">
                  {a.label}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{a.desc}</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Project status summary */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Project status</h2>
          <Link href="/tracker" className="text-xs text-[var(--blue)] font-semibold hover:underline flex items-center gap-1">
            View details <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-primary)] font-medium">Requirements gathering</span>
                <span className="text-[var(--text-muted)]">100%</span>
              </div>
              <div className="mt-1 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-primary)] font-medium">Design & prototype</span>
                <span className="text-[var(--text-muted)]">0%</span>
              </div>
              <div className="mt-1 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--blue)] rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-primary)] font-medium">Development</span>
                <span className="text-[var(--text-muted)]">0%</span>
              </div>
              <div className="mt-1 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--blue)] rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4">Quick resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/portfolio" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
              📂
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)]">Portfolio</div>
              <div className="text-xs text-[var(--text-muted)]">See our past projects</div>
            </div>
          </Link>
          <Link href="/reviews" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 text-xs font-bold">
              ⭐
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)]">Reviews</div>
              <div className="text-xs text-[var(--text-muted)]">What clients say</div>
            </div>
          </Link>
          <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-bold">
              👤
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)]">My profile</div>
              <div className="text-xs text-[var(--text-muted)]">Account settings</div>
            </div>
          </Link>
          <Link href="/support" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 text-xs font-bold">
              🎫
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--text-primary)]">Support</div>
              <div className="text-xs text-[var(--text-muted)]">Get help & tickets</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}