'use client'
import { useState, useEffect } from 'react'

interface User {
  id:           number
  name:         string
  email:        string
  role:         string
  company_name: string
  industry:     string
}

interface Project {
  id:         number
  title:      string
  status:     string
  budget_min: number
  created_at: string
}

export default function ProfilePage() {
  const [user,     setUser]     = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [editing,  setEditing]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState({
    name:         '',
    company_name: '',
    industry:     '',
  })
  const [saved, setSaved] = useState(false)

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetchProfile()
    fetchProjects()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUser(data)
      setForm({
        name:         data.name         || '',
        company_name: data.company_name || '',
        industry:     data.industry     || '',
      })
    } catch {}
  }

  async function fetchProjects() {
    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch {}
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function saveProfile() {
    setSaving(true)
    try {
      await fetch('http://localhost:5000/api/auth/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      setUser(prev => prev ? { ...prev, ...form } : null)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    setSaving(false)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const totalInvested = projects.reduce(
    (sum, p) => sum + (p.budget_min || 0), 0
  )

  const STATUS_COLORS: Record<string, string> = {
    discovery:   'bg-gray-100 text-gray-600',
    design:      'bg-purple-100 text-purple-700',
    development: 'bg-blue-100 text-blue-700',
    testing:     'bg-amber-100 text-amber-700',
    deploy:      'bg-orange-100 text-orange-700',
    live:        'bg-green-100 text-green-700',
    delivered:   'bg-teal-100 text-teal-700',
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading profile...</div>
      </div>
    )
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-2xl mx-auto">

      {/* Profile hero */}
      <div className="bg-blue-600 rounded-2xl p-6 mb-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              {user.company_name || 'No company set'} · {user.industry || 'No industry set'}
            </p>
            <span className="inline-block mt-2 text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full capitalize">
              {user.role}
            </span>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {editing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-5 pt-5 border-t border-white border-opacity-20">
          <div className="text-center">
            <div className="text-xl font-bold">{projects.length}</div>
            <div className="text-xs text-blue-200 mt-0.5">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">
              {totalInvested > 0
                ? `₹${(totalInvested / 100000).toFixed(1)}L`
                : '₹0'}
            </div>
            <div className="text-xs text-blue-200 mt-0.5">Invested</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">
              {projects.filter(p =>
                p.status === 'live' || p.status === 'delivered'
              ).length}
            </div>
            <div className="text-xs text-blue-200 mt-0.5">Completed</div>
          </div>
        </div>
      </div>

      {/* Saved success */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 text-center font-semibold">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 mb-5">
          <div className="text-sm font-bold text-gray-900 mb-4">
            Edit profile
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Company name
                </label>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Industry
                </label>
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Select...</option>
                  <option>Travel & Hospitality</option>
                  <option>E-commerce</option>
                  <option>Healthcare</option>
                  <option>EdTech</option>
                  <option>SaaS</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 text-sm rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5 mb-5">

        {/* Account details */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Account details
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <span className="font-medium text-gray-800 text-xs">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Role</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Company</span>
              <span className="font-medium">{user.company_name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Industry</span>
              <span className="font-medium">{user.industry || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Member ID</span>
              <span className="font-medium">#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Quick links
          </div>
          <div className="flex flex-col gap-2">
            {[
              { href: '/wizard',    label: 'Start new project',   color: 'bg-blue-600 text-white hover:bg-blue-700' },
              { href: '/tracker',   label: 'View live tracker',   color: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' },
              { href: '/chatbot',   label: 'Ask AI assistant',    color: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' },
              { href: '/proposal',  label: 'View proposal',       color: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' },
              { href: '/support',   label: 'Submit support ticket', color: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`w-full py-2 text-center text-sm font-semibold rounded-lg transition-colors ${link.color}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Projects list */}
      {projects.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            My projects
          </div>
          <div className="flex flex-col gap-2">
            {projects.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-none"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {p.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {p.created_at ? `Started ${new Date(p.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}` : 'Recently started'}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize
                  ${STATUS_COLORS[p.status] || STATUS_COLORS.discovery}`}>
                  {p.status}
                </span>
                {p.budget_min > 0 && (
                  <span className="text-xs font-semibold text-gray-500">
                    ₹{p.budget_min.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-5">
        <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">
          Account
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">Sign out</div>
            <div className="text-xs text-gray-400 mt-0.5">
              You will be redirected to the login page
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
          >
            Sign out
          </button>
        </div>
      </div>

    </div>
  )
}