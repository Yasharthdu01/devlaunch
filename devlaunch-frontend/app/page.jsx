export default function HomePage() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Projects delivered', value: '48' },
          { label: 'Happy clients',      value: '41' },
          { label: 'Avg. rating',        value: '4.9★' },
          { label: 'Industries',         value: '12' },
        ].map((m) => (
          <div key={m.label} className="bg-gray-100 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{m.label}</div>
            <div className="text-xl font-bold">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        What can we build for you?
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['Travel & Hospitality', 'E-commerce', 'Healthcare', 'EdTech', 'SaaS / Dashboards', 'Marketing & Growth'].map((cat) => (
          <div key={cat} className="bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-400 cursor-pointer transition-colors">
            <div className="text-xs font-semibold">{cat}</div>
          </div>
        ))}
      </div>
    </div>
  )
}