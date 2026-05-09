'use client'

const reviews = [
  {
    name: 'Rajesh Kumar',
    company: 'TravelNest Agency',
    initials: 'RK',
    avatarBg: 'bg-green-100',
    avatarText: 'text-green-800',
    rating: 5,
    text: '"They built our entire travel portal in 8 weeks. The AI onboarding wizard saved hours of planning. Best tech team I have worked with."',
    meta: 'Travel & Hospitality · Web app · ₹4.2L project',
  },
  {
    name: 'Ananya Sharma',
    company: 'EdQuest LMS',
    initials: 'AS',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-800',
    rating: 5,
    text: '"The 6-step wizard was incredible — AI recommended exactly the right tech stack. Deployed in 6 weeks as promised."',
    meta: 'EdTech · Web + Mobile · ₹3.8L project',
  },
  {
    name: 'Mohammed Viqar',
    company: 'ShopX Marketplace',
    initials: 'MV',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-800',
    rating: 4,
    text: '"AI chatbot resolved most queries instantly. Delivery was on time and the app handles peak load very well."',
    meta: 'E-commerce · Multi-vendor · ₹6.5L project',
  },
  {
    name: 'Priya Mehta',
    company: 'MediBook Health',
    initials: 'PM',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-800',
    rating: 5,
    text: '"HIPAA-compliant architecture, WebRTC video calls, e-prescriptions — all delivered perfectly. Highly professional team."',
    meta: 'Healthcare · Web app · ₹5.1L project',
  },
  {
    name: 'Amit Singh',
    company: 'FinTrack SaaS',
    initials: 'AS',
    avatarBg: 'bg-teal-100',
    avatarText: 'text-teal-800',
    rating: 5,
    text: '"Multi-tenant SaaS delivered with real-time dashboards, role-based access, and bank API integration. Exceeded expectations."',
    meta: 'SaaS · Dashboard · ₹3.2L project',
  },
  {
    name: 'Sneha Reddy',
    company: 'GrowMore Marketing',
    initials: 'SR',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-800',
    rating: 5,
    text: '"The marketing AI module generated perfect SEO keywords and ad copy for our niche. Website traffic increased 3x in 2 months."',
    meta: 'Marketing · Landing page + SEO · ₹1.8L project',
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-sm ${i <= count ? 'text-amber-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Client reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Real feedback from our clients</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Overall rating',    value: '4.9 / 5' },
          { label: 'Would recommend',   value: '97%' },
          { label: 'On-time delivery',  value: '100%' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-100 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall stars */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="text-4xl font-bold text-blue-600">4.9</div>
        <div>
          <Stars count={5} />
          <div className="text-xs text-gray-500 mt-1">Based on 41 client reviews</div>
        </div>
      </div>

      {/* Review cards */}
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        What clients say
      </div>
      <div className="flex flex-col gap-4">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            {/* Reviewer info */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full ${r.avatarBg} ${r.avatarText} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                {r.initials}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                <div className="text-xs text-gray-400">{r.company}</div>
              </div>
              <Stars count={r.rating} />
            </div>

            {/* Review text */}
            <p className="text-sm text-gray-600 leading-relaxed mb-2 italic">{r.text}</p>

            {/* Meta */}
            <div className="text-xs text-gray-400">{r.meta}</div>
          </div>
        ))}
      </div>

    </div>
  )
}