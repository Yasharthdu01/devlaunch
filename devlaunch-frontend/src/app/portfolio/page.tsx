'use client'
import Badge from '@/components/ui/Badge'

const projects = [
  {
    title: 'TravelNest booking portal',
    subtitle: 'Flight + hotel + tour management',
    desc: 'Full-stack booking platform with real-time availability, Razorpay payments, itinerary builder and admin CMS. Built in 8 weeks.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    status: 'Delivered',
    statusColor: 'teal',
  },
  {
    title: 'RoamApp — mobile travel app',
    subtitle: 'iOS & Android trip planner',
    desc: 'React Native app with offline maps, AI trip suggestions, currency converter. 10k+ downloads on Play Store.',
    tags: ['React Native', 'Firebase', 'FastAPI'],
    status: 'Delivered',
    statusColor: 'teal',
  },
  {
    title: 'MediBook — healthcare portal',
    subtitle: 'Telemedicine + appointments',
    desc: 'Multi-doctor video consultation, e-prescriptions, HIPAA-compliant architecture. Built with WebRTC.',
    tags: ['Vue.js', 'Django', 'MySQL', 'WebRTC'],
    status: 'Live',
    statusColor: 'blue',
  },
  {
    title: 'ShopX — e-commerce platform',
    subtitle: 'Multi-vendor marketplace',
    desc: 'Seller dashboard, AI product recommendations, SEO-optimized pages, warehouse integrations.',
    tags: ['Next.js', 'Node.js', 'MongoDB'],
    status: 'Growing',
    statusColor: 'green',
  },
  {
    title: 'EdQuest — LMS platform',
    subtitle: 'Learning management system',
    desc: 'Video courses, quiz engine, student dashboard, instructor panel, certificate generation.',
    tags: ['React', 'Django', 'PostgreSQL', 'AWS S3'],
    status: 'Live',
    statusColor: 'blue',
  },
  {
    title: 'FinTrack — SaaS dashboard',
    subtitle: 'Financial analytics platform',
    desc: 'Multi-tenant SaaS with real-time charts, CSV export, bank API integration, role-based access.',
    tags: ['Next.js', 'Node.js', 'Redis', 'Chart.js'],
    status: 'Delivered',
    statusColor: 'teal',
  },
]

export default function PortfolioPage() {
  return (
    <div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Our portfolio</h1>
        <p className="text-sm text-gray-500 mt-1">End-to-end projects we have delivered for clients</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total projects', value: '48' },
          { label: 'Industries',     value: '12' },
          { label: 'Avg. delivery',  value: '9 weeks' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-100 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Project cards */}
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Featured deliveries
      </div>
      <div className="grid grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p.title}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-semibold text-gray-900">{p.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{p.subtitle}</div>
              </div>
              <Badge color={p.statusColor}>{p.status}</Badge>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{p.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}