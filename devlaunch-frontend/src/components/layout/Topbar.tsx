// 'use client'
// import Link from 'next/link'
// import { MoreHorizontal } from 'lucide-react'

// export default function Topbar() {
//   return (
//     <div className="bg-white px-12 py-8 flex items-center justify-between flex-shrink-0">


//       {/* Left */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
//         <p className="text-sm text-gray-500 mt-1">Your AI-powered delivery platform</p>
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-3">
//         <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
//           <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
//           Live
//         </span>
//         <Link href="/chatbot">
//           <button className="text-sm px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold transition-all cursor-pointer">
//             Ask AI
//           </button>
//         </Link>
//         <Link href="/wizard">
//           <button className="text-sm px-5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold transition-all cursor-pointer">
//             Start project
//           </button>
//         </Link>
//         <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 transition-all cursor-pointer">
//           <MoreHorizontal size={20} />
//         </button>
//       </div>

//     </div>
//   )
// }
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/':           { title: 'Welcome back',       sub: 'Your AI-powered delivery platform'      },
  '/portfolio':  { title: 'Portfolio',           sub: 'End-to-end projects delivered'          },
  '/reviews':    { title: 'Client reviews',      sub: 'Real feedback from our clients'         },
  '/wizard':     { title: 'Start project',       sub: '6-step AI-guided onboarding'            },
  '/tracker':    { title: 'Live tracker',        sub: 'Track your project progress'            },
  '/proposal':   { title: 'Project proposal',    sub: 'AI-generated scope and cost'            },
  '/collab':     { title: 'Collaboration',       sub: 'Tasks, comments and files'              },
  '/deploy':     { title: 'Deployment',          sub: 'Deploy to production'                   },
  '/chatbot':    { title: 'AI assistant',        sub: 'Powered by Ollama LLM'                  },
  '/mvp':        { title: 'Build my MVP',        sub: 'Idea to full spec in seconds'           },
  '/marketing':  { title: 'Marketing AI',        sub: 'SEO keywords, social posts and ads'     },
  '/support':    { title: 'Support & tickets',   sub: 'Bug reports and maintenance'            },
  '/admin':      { title: 'Admin panel',         sub: 'Manage clients, projects and revenue'   },
  '/profile':    { title: 'My profile',          sub: 'Account details and settings'           },
}

export default function Topbar() {
  const pathname = usePathname()
  const meta = PAGE_META[pathname] || { title: 'DevLaunch', sub: 'AI delivery platform' }

  return (
    <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
      <div>
        <div className="text-sm font-bold text-gray-800">{meta.title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{meta.sub}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
          ● Live
        </span>
        <Link href="/chatbot">
          <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer">
            Ask AI
          </button>
        </Link>
        <Link href="/wizard">
          <button className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            Start project
          </button>
        </Link>
        <Link href="/profile">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-blue-200 transition-colors">
            TJ
          </div>
        </Link>
      </div>
    </div>
  )
}