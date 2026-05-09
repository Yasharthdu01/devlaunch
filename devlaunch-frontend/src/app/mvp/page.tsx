'use client'
import { useState } from 'react'
import Link from 'next/link'

interface TimelineItem {
  phase: string
  task:  string
}

interface MVPData {
  app_name:   string
  tagline:    string
  features:   string[]
  pages:      string[]
  stack:      Record<string, string>
  timeline:   TimelineItem[]
  cost:       { min: number; max: number; currency: string }
  complexity: string
}

const COMPLEXITY_COLORS: Record<string, string> = {
  simple: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  complex: 'bg-red-100 text-red-700',
}

const EXAMPLE_IDEAS = [
  'Travel booking app for Varanasi tours',
  'Online doctor appointment system',
  'Multi-vendor e-commerce marketplace',
  'Student learning management system',
  'Restaurant food ordering platform',
  'Freelancer project management tool',
]

export default function MVPPage() {
  const [idea,    setIdea]    = useState('')
  const [data,    setData]    = useState<MVPData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  async function generate() {
    if (!idea.trim()) {
      setError('Please enter your app idea')
      return
    }
    setError('')
    setLoading(true)
    setData(null)

    try {
      const res = await fetch('http://localhost:5000/api/mvp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idea }),
      })
      const result = await res.json()
      setData(result)
    } catch {
      setError('Server error. Make sure backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Hero input */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">⚡</span>
          <h1 className="text-lg font-bold text-gray-900">Build my MVP</h1>
        </div>
        <p className="text-sm text-gray-400 mb-5">
          Enter your app idea — AI instantly generates features, pages,
          tech stack, timeline and cost estimate
        </p>

        <div className="flex gap-3 mb-4">
          <input
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder="e.g. Travel booking app for Varanasi tours..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={generate}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {loading ? '⟳ Generating...' : '⚡ Generate MVP'}
          </button>
        </div>

        {/* Example ideas */}
        <div>
          <div className="text-xs text-gray-400 mb-2">Try an example:</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_IDEAS.map(ex => (
              <button
                key={ex}
                onClick={() => setIdea(ex)}
                className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400 mb-2">
              AI is analyzing your idea...
            </div>
            <div className="flex justify-center gap-1">
              {['Features', 'Pages', 'Stack', 'Timeline', 'Cost'].map((s, i) => (
                <span
                  key={s}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {data && (
        <div className="flex flex-col gap-5">

          {/* App header */}
          <div className="bg-blue-600 rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">{data.app_name}</h2>
                <p className="text-blue-200 text-sm">{data.tagline}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize
                ${COMPLEXITY_COLORS[data.complexity] || COMPLEXITY_COLORS.medium}`}>
                {data.complexity} complexity
              </span>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="text-center">
                <div className="text-xl font-bold">
                  ₹{Math.round(data.cost.min / 100000 * 10) / 10}L
                </div>
                <div className="text-xs text-blue-200">Min cost</div>
              </div>
              <div className="w-px bg-blue-500" />
              <div className="text-center">
                <div className="text-xl font-bold">
                  ₹{Math.round(data.cost.max / 100000 * 10) / 10}L
                </div>
                <div className="text-xs text-blue-200">Max cost</div>
              </div>
              <div className="w-px bg-blue-500" />
              <div className="text-center">
                <div className="text-xl font-bold">10</div>
                <div className="text-xs text-blue-200">Weeks</div>
              </div>
              <div className="w-px bg-blue-500" />
              <div className="text-center">
                <div className="text-xl font-bold">{data.features.length}</div>
                <div className="text-xs text-blue-200">Features</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">

            {/* Features */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Core features
              </div>
              <div className="flex flex-col gap-2">
                {data.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">{f}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pages */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Pages needed
              </div>
              <div className="flex flex-col gap-2">
                {data.pages.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-none">
                    <div className="w-5 h-5 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="text-sm text-gray-700">{p}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tech stack */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Recommended tech stack
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(data.stack).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 capitalize mb-1">{key}</div>
                  <div className="text-sm font-semibold text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Development timeline
            </div>
            <div className="flex flex-col gap-3">
              {data.timeline.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-20 text-xs font-bold text-blue-600 flex-shrink-0">
                    {item.phase}
                  </div>
                  <div className="flex-1 h-px bg-gray-100" />
                  <div className="text-sm text-gray-700">{item.task}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-gray-900 mb-1">
                Ready to build this?
              </div>
              <div className="text-xs text-gray-400">
                Go through our 6-step wizard to get a detailed proposal
              </div>
            </div>
            <Link href="/wizard">
              <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Start project →
              </button>
            </Link>
          </div>

        </div>
      )}
    </div>
  )
}