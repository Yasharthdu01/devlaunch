'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
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
    <div className="
      bg-[var(--bg-primary)]
      border-b border-[var(--border)]
      px-5 py-3 flex items-center justify-between flex-shrink-0
    ">
      <div>
        <div className="text-sm font-bold text-[var(--text-primary)]">
          {meta.title}
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-0.5">
          {meta.sub}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
          ● Live
        </span>

        <ThemeToggle />

        <Link href="/chatbot">
          <button className="
            text-xs px-3 py-1.5 rounded-lg border cursor-pointer
            border-[var(--border)]
            bg-[var(--bg-primary)]
            text-[var(--text-secondary)]
            hover:bg-[var(--bg-tertiary)]
          ">
            Ask AI
          </button>
        </Link>

        <Link href="/wizard">
          <button className="
            text-xs px-3 py-1.5 rounded-lg cursor-pointer
            bg-[var(--blue)] hover:opacity-90
            text-white font-semibold
          ">
            Start project
          </button>
        </Link>

        <Link href="/profile">
          <div className="
            w-8 h-8 rounded-full cursor-pointer
            bg-[var(--blue-light)]
            text-[var(--blue)]
            flex items-center justify-center
            text-xs font-bold
            hover:opacity-80
            transition-all
          ">
            TJ
          </div>
        </Link>
      </div>
    </div>
  )
}