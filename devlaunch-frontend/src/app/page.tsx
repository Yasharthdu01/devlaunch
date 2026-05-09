'use client'
import Link from 'next/link'
import { ArrowRight, Plane, ShoppingCart, Activity, GraduationCap, Layout, Target } from 'lucide-react'

const metrics = [
  { label: 'Projects delivered', value: '48',   change: '↑ 6 this quarter', color: 'text-green-600' },
  { label: 'Happy clients',      value: '41',   change: '↑ 4 this month',   color: 'text-green-600' },
  { label: 'Avg. rating',        value: '4.9★', change: '41 reviews',       color: 'text-green-600' },
  { label: 'Industries served',  value: '12',   change: 'Travel, Health...', color: 'text-blue-600' },
]

const categories = [
  {
    icon: <Plane className="text-blue-500" size={24} />,
    name: 'Travel & Hospitality',
    desc: 'Booking portals, itinerary apps, tour management systems.',
    tags: ['Web app', 'Mobile', 'CMS'],
  },
  {
    icon: <ShoppingCart className="text-orange-500" size={24} />,
    name: 'E-commerce',
    desc: 'Multi-vendor stores, inventory, payment integrations.',
    tags: ['Web app', 'Admin', 'SEO'],
  },
  {
    icon: <Activity className="text-red-500" size={24} />,
    name: 'Healthcare',
    desc: 'Patient portals, telemedicine, appointment booking.',
    tags: ['Web app', 'Mobile'],
  },
  {
    icon: <GraduationCap className="text-purple-500" size={24} />,
    name: 'EdTech',
    desc: 'LMS platforms, quiz engines, video course portals.',
    tags: ['Web app', 'API'],
  },
  {
    icon: <Layout className="text-emerald-500" size={24} />,
    name: 'SaaS / Dashboards',
    desc: 'B2B tools, analytics portals, CRM systems.',
    tags: ['Web app', 'API'],
  },
  {
    icon: <Target className="text-rose-500" size={24} />,
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
    <div className="max-w-[1400px] mx-auto px-12 py-10">


      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-gray-900 mb-1">{m.value}</div>
            <div className="text-[13px] font-medium text-gray-400 mb-3">{m.label}</div>
            <div className={`text-[11px] font-semibold px-2 py-1 rounded-full inline-block bg-gray-50 ${m.color}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div className="mb-10">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
          What can we build for you?
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                {cat.icon}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">{cat.name}</div>
              <div className="text-sm text-gray-500 leading-relaxed mb-6 h-10 overflow-hidden">
                {cat.desc}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-10">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
          Our technology stack
        </div>
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stack.map((s) => (
              <div key={s.label}>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{s.label}</div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <span key={item} className="text-xs font-medium px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-default">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-blue-600 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to build your project?</h2>
          <p className="text-blue-100 opacity-90">Go through our 6-step AI wizard and get a proposal in minutes.</p>
        </div>
        <Link href="/wizard" className="relative z-10 w-full md:w-auto">
          <button className="w-full bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
            Start project
            <ArrowRight size={20} />
          </button>
        </Link>
      </div>

    </div>
  )
}
 