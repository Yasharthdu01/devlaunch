'use client'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Users, Rocket, Globe, Heart } from 'lucide-react'

const values = [
  {
    icon: '🎯',
    title: 'Transparency first',
    desc: 'No black box. Clients see every milestone, every task, every update in real time. We believe trust is built through visibility.',
  },
  {
    icon: '⚡',
    title: 'Speed without compromise',
    desc: 'We deliver in 6-10 weeks because we run frontend and backend in parallel — not sequentially like traditional agencies.',
  },
  {
    icon: '🤖',
    title: 'AI-powered everything',
    desc: 'From onboarding to proposals to chatbot support — AI reduces our overhead so we can charge less and deliver more.',
  },
  {
    icon: '🤝',
    title: 'Long-term partnership',
    desc: 'We dont disappear after delivery. Monthly maintenance plans, support tickets, and feature updates — we grow with you.',
  },
]

const team = [
  {
    name:    'Yasharth Dubey',
    role:    'Founder & Lead Developer',
    bio:     '1.5+ years as SDE at Hackett Group. Full-stack engineer specializing in Next.js, Node.js, PostgreSQL and AI integrations. Built DevLaunch from scratch.',
    initials: 'YD',
    bg:      'bg-blue-100 dark:bg-blue-900',
    text:    'text-blue-700 dark:text-blue-300',
    skills:  ['Next.js', 'Node.js', 'PostgreSQL', 'AI/LLM', 'AWS'],
  },
]

const milestones = [
  { year: '2024', event: 'Started as a freelance developer building websites for local businesses in Kanpur' },
  { year: 'Early 2025', event: 'Joined Hackett Group as SDE — built AI-powered SaaS platforms for enterprise clients' },
  { year: 'Mid 2025', event: 'Identified the gap — Indian SMBs need software but agencies are slow, opaque and expensive' },
  { year: 'Late 2025', event: 'Started building DevLaunch — an AI-powered delivery platform with full client transparency' },
  { year: '2026', event: 'DevLaunch launched publicly — 40+ clients onboarded, 48+ projects delivered across India' },
]

const stats = [
  { num: '48+',  label: 'Projects delivered'    },
  { num: '40+',  label: 'Happy clients'          },
  { num: '12',   label: 'Industries served'      },
  { num: '4.9★', label: 'Average client rating'  },
  { num: '6-10', label: 'Weeks avg. delivery'    },
  { num: '100%', label: 'On-time delivery rate'  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Simple nav */}
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-blue-600 dark:text-blue-400">
          Dev<span className="text-gray-900 dark:text-white">Launch</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            ← Back to home
          </Link>
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Get started free
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50/50 dark:from-blue-950/20 to-white dark:to-gray-900 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-8 border border-blue-100 dark:border-blue-900">
            🇮🇳 Built in India, for India
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            We exist because Indian SMBs<br />
            <span className="text-blue-600 dark:text-blue-400">deserve better software</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
            Most agencies take your money, disappear for months and deliver something you didn't ask for.
            DevLaunch is built differently — transparent, fast, AI-powered and client-first.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
                Start your project
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/contact">
              <button className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold px-6 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-all">
                Talk to us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{s.num}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
              Our story
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
              Why we built DevLaunch
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4 text-sm">
              After working as an SDE at Hackett Group and building AI-powered SaaS platforms for enterprise clients, I noticed something painful — the same technology that large companies use was completely out of reach for small Indian businesses.
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4 text-sm">
              A dental clinic owner in Lucknow has to manage appointments on paper. A travel agency in Varanasi still takes bookings over phone calls. A builder in Kanpur tracks leads in a notebook. They all know they need software — but agencies are expensive, slow and zero accountability.
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 text-sm">
              So I built DevLaunch — a platform where clients onboard themselves in 10 minutes with an AI wizard, get an instant proposal, track their project live, and get their product delivered in 6-10 weeks. No black box. No surprises.
            </p>
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-100 dark:border-blue-900">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                YD
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">Yasharth Dubey</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">Founder, DevLaunch</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6">
              Our journey
            </div>
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-4 pb-6 relative">
                  {i < milestones.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-xs font-black flex-shrink-0 z-10">
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{m.year}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{m.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
              Our values
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              What we believe in
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
              The team
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Who builds DevLaunch
            </h2>
          </div>
          {team.map(member => (
            <div key={member.name} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className={`w-20 h-20 rounded-2xl ${member.bg} ${member.text} flex items-center justify-center text-2xl font-black flex-shrink-0`}>
                {member.initials}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3">{member.role}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map(skill => (
                    <span key={skill} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What makes us different */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
              Why choose us
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              DevLaunch vs traditional agencies
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { them: 'Call/email to get started — takes days',       us: 'AI wizard onboarding — done in 10 minutes'          },
              { them: 'Quote takes 3-7 days to arrive',               us: 'Instant AI cost estimate on the platform'           },
              { them: 'No visibility into what is happening',          us: 'Live project tracker — every milestone visible'     },
              { them: 'Proposal is a vague Word document',            us: 'AI-generated PDF with scope, timeline, cost'        },
              { them: 'Communication only on WhatsApp groups',        us: 'Built-in tasks, comments, file uploads'             },
              { them: 'Support ends after delivery',                   us: 'Monthly maintenance + 24/7 AI chatbot support'     },
              { them: '6+ months delivery timeline',                   us: '6-10 weeks — frontend + backend in parallel'       },
              { them: 'Hidden charges surprise you at the end',       us: 'Transparent pricing — no surprises ever'            },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl p-4">
                  <div className="text-xs font-bold text-red-400 mb-2">❌ Others</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{row.them}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 rounded-xl p-4">
                  <div className="text-xs font-bold text-green-600 dark:text-green-400 mb-2">✅ DevLaunch</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{row.us}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600 dark:bg-blue-700 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="text-blue-200 text-base mb-8 leading-relaxed">
            Join 40+ businesses who chose DevLaunch for transparent, fast and AI-powered delivery.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <button className="flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl text-sm hover:bg-blue-50 transition-all">
                Start project wizard
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/contact">
              <button className="flex items-center gap-2 bg-transparent text-white font-bold px-8 py-4 rounded-2xl text-sm border-2 border-white/40 hover:border-white/70 transition-all">
                Contact us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 dark:bg-black text-white py-8 px-6 text-center">
        <div className="text-xs text-gray-500">
          © 2026 DevLaunch · Built in Kanpur, India 🇮🇳
          <span className="mx-3">·</span>
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-3">·</span>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          <span className="mx-3">·</span>
          <Link href="/register" className="hover:text-gray-300">Get started</Link>
        </div>
      </footer>

    </div>
  )
}