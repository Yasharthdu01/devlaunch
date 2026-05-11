'use client'
import { useState, useEffect } from 'react'

interface Ticket {
  id:          number
  title:       string
  description: string
  type:        string
  status:      string
  priority:    string
  created_at:  string
}

const STATUS_STYLES: Record<string, string> = {
  open:        'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved:    'bg-green-100 text-green-700',
  closed:      'bg-gray-100 text-gray-500',
}

const PRIORITY_STYLES: Record<string, string> = {
  low:      'bg-gray-100 text-gray-500',
  medium:   'bg-amber-100 text-amber-700',
  high:     'bg-red-100 text-red-700',
  critical: 'bg-red-200 text-red-800',
}

const TYPE_STYLES: Record<string, string> = {
  bug:     'bg-red-100 text-red-700',
  feature: 'bg-blue-100 text-blue-700',
  support: 'bg-purple-100 text-purple-700',
  other:   'bg-gray-100 text-gray-600',
}

export default function SupportPage() {
  const [tickets,   setTickets]   = useState<Ticket[]>([])
  const [showForm,  setShowForm]  = useState(false)
  const [loading,   setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title:       '',
    description: '',
    type:        'bug',
    priority:    'medium',
  })

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  useEffect(() => { fetchTickets() }, [])

  async function fetchTickets() {
    setLoading(true)
    try {
      const res = await fetch('${API_URL}/api/support', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : [])
    } catch {}
    setLoading(false)
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submitTicket() {
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('${API_URL}/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setTickets(prev => [data, ...prev])
      setForm({ title: '', description: '', type: 'bug', priority: 'medium' })
      setShowForm(false)
    } catch {}
    setSubmitting(false)
  }

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch(`${API_URL}/api/support/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      setTickets(prev => prev.map(t => t.id === id ? data : t))
    } catch {}
  }

  async function deleteTicket(id: number) {
    try {
      await fetch(`${API_URL}/api/support/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setTickets(prev => prev.filter(t => t.id !== id))
    } catch {}
  }

  const open     = tickets.filter(t => t.status === 'open').length
  const progress = tickets.filter(t => t.status === 'in_progress').length
  const resolved = tickets.filter(t => t.status === 'resolved').length

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Support & tickets</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Bug reports, feature requests and maintenance
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Open',        value: open,     color: 'text-blue-600',  bg: 'bg-blue-50'  },
          { label: 'In progress', value: progress, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Resolved',    value: resolved,  color: 'text-green-600', bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* New ticket form */}
      {showForm && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 mb-5">
          <div className="text-sm font-bold text-gray-900 mb-4">Create new ticket</div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Brief description of the issue..."
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                rows={3}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                >
                  <option value="bug">Bug</option>
                  <option value="feature">Feature request</option>
                  <option value="support">Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={submitTicket}
                disabled={submitting || !form.title.trim()}
                className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit ticket'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-sm rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets list */}
      {loading ? (
        <div className="text-center text-gray-400 text-sm py-8">
          Loading tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-300 text-4xl mb-3">🎫</div>
          <div className="text-gray-500 text-sm mb-1">No tickets yet</div>
          <div className="text-gray-400 text-xs">
            Click "New ticket" to report a bug or request a feature
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map(t => (
            <div
              key={t.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    #{t.id} · {t.title}
                  </div>
                  {t.description && (
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteTicket(t.id)}
                  className="text-gray-300 hover:text-red-400 text-xl leading-none flex-shrink-0"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_STYLES[t.type] || TYPE_STYLES.other}`}>
                  {t.type}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLES[t.priority] || PRIORITY_STYLES.medium}`}>
                  {t.priority}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(t.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short'
                    })}
                  </span>
                  <select
                    value={t.status}
                    onChange={e => updateStatus(t.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full font-semibold border-none outline-none cursor-pointer
                      ${STATUS_STYLES[t.status] || STATUS_STYLES.open}`}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Maintenance plans */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-6">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Maintenance plans
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Basic',    desc: 'Bug fixes only',                price: '₹5,000/mo',  color: 'border-gray-200' },
            { name: 'Standard', desc: 'Bugs + minor features',         price: '₹12,000/mo', color: 'border-blue-300' },
            { name: 'Premium',  desc: 'Dedicated dev hours (40hrs/mo)', price: '₹25,000/mo', color: 'border-purple-300' },
          ].map(plan => (
            <div key={plan.name} className={`border-2 ${plan.color} rounded-xl p-4 text-center`}>
              <div className="text-sm font-bold text-gray-900 mb-1">{plan.name}</div>
              <div className="text-xs text-gray-400 mb-3">{plan.desc}</div>
              <div className="text-base font-bold text-blue-600">{plan.price}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}