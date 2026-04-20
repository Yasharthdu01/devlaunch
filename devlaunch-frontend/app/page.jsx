'use client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Link from 'next/link'

const metrics = [
  { label: 'Projects delivered', value: '48',   change: '↑ 6 this quarter' },
  { label: 'Happy clients',      value: '41',   change: '↑ 4 this month' },
  { label: 'Avg. rating',        value: '4.9★', change: '41 reviews' },
  { label: 'Industries served',  value: '12',   change: 'Travel, Health…' },
]

const categories = [
  {
    icon: '✈️',
    name: 'Travel & Hospitality',
    desc: 'Booking portals, itinerary apps, tour management systems.',
    tags: ['Web app', 'Mobile', 'CMS'],
  },
  {
    icon: '🛒',
    name: 'E-commerce',
    desc: 'Multi-vendor stores, inventory, payment integrations.',
    tags: ['Web app', 'Admin', 'SEO'],
  },
  {
    icon: '🏥',
    name: 'Healthcare',
    desc: 'Patient portals, telemedicine, appointment booking.',
    tags: ['Web app', 'Mobile'],
  },
  {
    icon: '🎓',
    name: 'EdTech',
    desc: 'LMS platforms, quiz engines, video course portals.',
    tags: ['Web app', 'API'],
  },
  {
    icon: '📊',
    name: 'SaaS / Dashboards',
    desc: 'B2B tools, analytics portals, CRM systems.',
    tags: ['Web app', 'API'],
  },
  {
    icon: '📣',
    name: 'Marketing & Growth',
    desc: 'Landing pages, SEO sites, ad campaigns.',
    tags: ['SEO', 'Ads'],
  },
]

const stack = [
  { label: 'Frontend',   items: ['Next.js', 'React Native', 'Flutter'] },
  { label: 'Backend',    items: ['Node.js', 'FastAPI', 'Django'] },
  { label: 'Database',   items: ['PostgreSQL', 'MongoDB', 'Redis'] },
  { label: 'Cloud & AI', items: ['AWS', 'Vercel', 'Claude API'] },
]

export default function HomePage() {
  return (
    <div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-gray-100 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">{m.label}</div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div className="text-xs text-green-600 mt-1">{m.change}</div>
          </div>
        ))}
      </div>

      {/* Categories heading */}
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        What can we build for you?
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="text-sm font-semibold text-gray-800 mb-1">{cat.name}</div>
            <div className="text-xs text-gray-500 leading-relaxed mb-3">{cat.desc}</div>
            <div className="flex flex-wrap gap-1">
              {cat.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Our technology stack
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex gap-6 flex-wrap">
          {stack.map((s) => (
            <div key={s.label} className="flex-1 min-w-24">
              <div className="text-xs text-gray-400 mb-2">{s.label}</div>
              <div className="flex flex-wrap gap-1">
                {s.items.map((item) => (
                  <span key={item} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-blue-600 rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-white font-semibold text-sm">Ready to build your project?</div>
          <div className="text-blue-200 text-xs mt-1">Go through our 6-step AI wizard and get a proposal in minutes.</div>
        </div>
        <Link href="/wizard">
          <button className="bg-white text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Start project →
          </button>
        </Link>
      </div>

    </div>
  )
} 