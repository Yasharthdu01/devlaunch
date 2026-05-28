'use client'
import { useState, useEffect } from 'react'
import API_URL from '@/lib/config'

const STATUS_COLORS = {
  discovery:   'bg-gray-100 text-gray-600',
  design:      'bg-purple-100 text-purple-700',
  development: 'bg-blue-100 text-blue-700',
  testing:     'bg-amber-100 text-amber-700',
  deploy:      'bg-orange-100 text-orange-700',
  live:        'bg-green-100 text-green-700',
  delivered:   'bg-teal-100 text-teal-700',
}

const DEVELOPERS = [
  'Ravi Kumar',
  'Priya Mehta',
  'Amit Singh',
  'Sneha Reddy',
  'Unassigned',
]

function RevenueBar({ data }) {
  if (!data || data.length === 0) return (
    <div className="text-sm text-gray-400 text-center py-8">
      No revenue data yet
    </div>
  )

  const max = Math.max(...data.map(d => parseInt(d.revenue) || 0))

  return (
    <div className="flex items-end gap-3 h-36 px-2">
      {data.map((d, i) => {
        const height = max > 0
          ? Math.max(4, Math.round((parseInt(d.revenue) / max) * 100))
          : 4
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="text-xs text-gray-500 font-semibold">
              {parseInt(d.revenue) > 0
                ? `₹${Math.round(parseInt(d.revenue) / 1000)}k`
                : ''}
            </div>
            <div
              className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
              style={{ height: `${height}%` }}
              title={`${d.month}: ₹${parseInt(d.revenue).toLocaleString('en-IN')}`}
            />
            <div className="text-xs text-gray-400 text-center leading-tight">
              {d.month}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AdminPage() {
  const [stats,    setStats]    = useState(null)
  const [clients,  setClients]  = useState([])
  const [projects, setProjects] = useState([])
  const [revenue,  setRevenue]  = useState([])
  const [tab,      setTab]      = useState('overview')
  const [loading,  setLoading]  = useState(true)

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [s, c, p, r] = await Promise.all([
        fetch(API_URL +'/api/admin/stats',    { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(API_URL +'/api/admin/clients',  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(API_URL +'/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(API_URL +'/api/admin/revenue',  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ])
      setStats(s)
      setClients(Array.isArray(c) ? c : [])
      setProjects(Array.isArray(p) ? p : [])
      setRevenue(Array.isArray(r) ? r : [])
    } catch {}
    setLoading(false)
  }

  async function updateProject(id, field, value) {
    try {
      const res = await fetch(
        API_URL + `/api/admin/projects/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      )
      const data = await res.json()
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="w-full">

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total clients',
            value: stats?.total_clients ?? 0,
            change: 'registered users',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Total projects',
            value: stats?.total_projects ?? 0,
            change: 'all time',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          },
          {
            label: 'Active projects',
            value: stats?.active_projects ?? 0,
            change: 'in progress',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Total revenue',
            value: `₹${((stats?.total_revenue ?? 0) / 100000).toFixed(1)}L`,
            change: 'from all projects',
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
        ].map(m => (
          <div key={m.label} className={`${m.bg} rounded-xl p-4`}>
            <div className="text-xs text-gray-500 mb-1">{m.label}</div>
            <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-xs text-gray-400 mt-1">{m.change}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'overview',  label: 'Overview'  },
          { id: 'projects',  label: 'Projects'  },
          { id: 'clients',   label: 'Clients'   },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all
              ${tab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Revenue chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Revenue by month
            </div>
            <RevenueBar data={revenue} />
          </div>

          {/* Project status breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Project pipeline
            </div>
            {['discovery', 'design', 'development', 'testing', 'deploy', 'live', 'delivered'].map(status => {
              const count = projects.filter(p => p.status === status).length
              const pct = projects.length > 0
                ? Math.round((count / projects.length) * 100) : 0
              return (
                <div key={status} className="flex items-center gap-3 mb-3">
                  <div className="w-20 text-xs text-gray-500 capitalize">{status}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-xs font-semibold text-gray-600 w-6 text-right">
                    {count}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent clients */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Recent clients
            </div>
            {clients.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-none">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {(c.name || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{c.name}</div>
                  <div className="text-xs text-gray-400 truncate">{c.company_name || c.email}</div>
                </div>
                <div className="text-xs font-semibold text-gray-500">
                  {c.project_count} project{c.project_count !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>

          {/* Recent projects */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Recent projects
            </div>
            {projects.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-none">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{p.title}</div>
                  <div className="text-xs text-gray-400">{p.client_name}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize
                  ${STATUS_COLORS[p.status] || STATUS_COLORS.discovery}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* PROJECTS TAB */}
      {tab === 'projects' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Project</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Developer</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Budget</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{p.title}</div>
                    <div className="text-xs text-gray-400">#{p.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700">{p.client_name}</div>
                    <div className="text-xs text-gray-400">{p.company_name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status}
                      onChange={e => updateProject(p.id, 'status', e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-semibold border-none outline-none cursor-pointer
                        ${STATUS_COLORS[p.status] || STATUS_COLORS.discovery}`}
                    >
                      {['discovery','design','development','testing','deploy','live','delivered'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.platform || 'Unassigned'}
                      onChange={e => updateProject(p.id, 'developer', e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-200 rounded-lg outline-none bg-white text-gray-600"
                    >
                      {DEVELOPERS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {p.budget_min
                      ? `₹${parseInt(p.budget_min).toLocaleString('en-IN')}`
                      : '—'}
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No projects yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CLIENTS TAB */}
      {tab === 'clients' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Industry</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Projects</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Total value</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {(c.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.company_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {c.industry || 'Not set'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700 text-center">
                    {c.project_count}
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-700">
                    {parseInt(c.total_value) > 0
                      ? `₹${parseInt(c.total_value).toLocaleString('en-IN')}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No clients yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}