'use client'
import { useState, useEffect } from 'react'
import API_URL from '@/lib/config'

const STAGES = ['discovery', 'design', 'development', 'testing', 'deploy', 'live']

const STAGE_LABELS = {
  discovery:   'Discovery',
  design:      'Design',
  development: 'Development',
  testing:     'Testing',
  deploy:      'Deploy',
  live:        'Live',
}

const STATUS_COLORS = {
  pending:     'bg-gray-200 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  done:        'bg-green-100 text-green-700',
}

function getProgress(status) {
  const idx = STAGES.indexOf(status)
  if (idx === -1) return 0
  return Math.round(((idx + 1) / STAGES.length) * 100)
}

export default function TrackerPage() {
  const [projects,   setProjects]   = useState([])
  const [selected,   setSelected]   = useState(null)
  const [milestones, setMilestones] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [newTitle,   setNewTitle]   = useState('')
  const [newDate,    setNewDate]    = useState('')
  const [adding,     setAdding]     = useState(false)

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selected) fetchMilestones(selected.id)
  }, [selected])

  async function fetchProjects() {
    setLoading(true)
    try {
      const res = await fetch(API_URL + '/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setProjects(data)
      if (data.length > 0) setSelected(data[0])
    } catch {}
    setLoading(false)
  }

  async function fetchMilestones(projectId) {
    try {
      const res = await fetch(
        API_URL + `/api/milestones/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setMilestones(data)
    } catch {}
  }

  async function updateStatus(status) {
    try {
      const res = await fetch(
        API_URL + `/api/projects/${selected.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      )
      const data = await res.json()
      setSelected(data)
      setProjects(prev =>
        prev.map(p => (p.id === data.id ? data : p))
      )
    } catch {}
  }

  async function updateMilestone(id, status) {
    try {
      await fetch(API_URL + `/api/milestones/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      setMilestones(prev =>
        prev.map(m => (m.id === id ? { ...m, status } : m))
      )
    } catch {}
  }

  async function addMilestone() {
    if (!newTitle.trim()) return
    setAdding(true)
    try {
      const res = await fetch(API_URL + '/api/milestones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: selected.id,
          title: newTitle,
          due_date: newDate || null,
        }),
      })
      const data = await res.json()
      setMilestones(prev => [...prev, data])
      setNewTitle('')
      setNewDate('')
    } catch {}
    setAdding(false)
  }

  async function deleteMilestone(id) {
    try {
      await fetch(API_URL + `/api/milestones/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setMilestones(prev => prev.filter(m => m.id !== id))
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading projects...</div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-gray-400 text-sm">No projects yet</div>
        <a href="/wizard"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          Start a project →
        </a>
      </div>
    )
  }

  const progress = selected ? getProgress(selected.status) : 0

  return (
    <div className="w-full">

      {/* Project selector */}
      {projects.length > 1 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`px-4 py-1.5 text-sm rounded-lg border transition-colors
                ${selected?.id === p.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div>
          {/* Project header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">{selected.title}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{selected.description}</p>
              </div>
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize">
                {selected.status}
              </span>
            </div>

            {/* Stage bar */}
            <div className="flex items-start mb-4">
              {STAGES.map((stage, i) => (
                <div key={stage} className="flex items-center flex-1">
                  <div className="flex flex-col items-center w-full">
                    <button
                      onClick={() => updateStatus(stage)}
                      className={`w-full py-1.5 text-xs font-semibold border-t-2 transition-all text-center
                        ${selected.status === stage
                          ? 'border-blue-500 text-blue-600'
                          : STAGES.indexOf(selected.status) > i
                            ? 'border-green-500 text-green-600'
                            : 'border-gray-200 text-gray-400 hover:border-gray-400'
                        }`}
                    >
                      {STAGES.indexOf(selected.status) > i ? '✓ ' : ''}
                      {STAGE_LABELS[stage]}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Overall progress</span>
                <span className="font-semibold text-gray-700">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">

            {/* Milestones */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Milestones
              </div>

              {milestones.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4">
                  No milestones yet
                </div>
              ) : (
                <div className="flex flex-col gap-1 mb-4">
                  {milestones.map(m => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-none"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0
                        ${m.status === 'done'        ? 'bg-green-500' :
                          m.status === 'in_progress' ? 'bg-blue-500'  : 'bg-gray-300'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-800 truncate">{m.title}</div>
                        {m.due_date && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {new Date(m.due_date).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                      <select
                        value={m.status}
                        onChange={e => updateMilestone(m.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-none outline-none cursor-pointer font-semibold
                          ${STATUS_COLORS[m.status] || STATUS_COLORS.pending}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => deleteMilestone(m.id)}
                        className="text-gray-300 hover:text-red-400 text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add milestone */}
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMilestone()}
                  placeholder="Add new milestone..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={addMilestone}
                    disabled={adding || !newTitle.trim()}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {adding ? '...' : '+ Add'}
                  </button>
                </div>
              </div>
            </div>

            {/* Contract & details */}
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Project details
                </div>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Project ID</span>
                    <span className="font-semibold">#{selected.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="font-semibold capitalize">{selected.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Budget</span>
                    <span className="font-semibold">
                      {selected.budget_min
                        ? `₹${selected.budget_min.toLocaleString('en-IN')}`
                        : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timeline</span>
                    <span className="font-semibold">
                      {selected.timeline_weeks
                        ? `${selected.timeline_weeks} weeks`
                        : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Started</span>
                    <span className="font-semibold">
                      {new Date(selected.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Quick actions
                </div>
                <div className="flex flex-col gap-2">
                  <a href="/proposal"
                    className="w-full py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 text-center transition-colors">
                    View proposal
                  </a>
                  <a href="/chatbot"
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 text-center transition-colors">
                    Ask AI assistant
                  </a>
                  <a href="/collab"
                    className="w-full py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 text-center transition-colors">
                    Team collaboration
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}