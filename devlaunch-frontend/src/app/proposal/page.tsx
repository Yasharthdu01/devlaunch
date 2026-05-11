'use client'
import { useState } from 'react'

export default function ProposalPage() {
  const [projectId, setProjectId]   = useState('')
  const [proposal,  setProposal]    = useState<any>(null)
  const [loading,   setLoading]     = useState(false)
  const [error,     setError]       = useState('')

  async function generateProposal() {
    if (!projectId) {
      setError('Please enter a project ID')
      return
    }
    setLoading(true)
    setError('')
    setProposal(null)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('${API_URL}/api/proposals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ project_id: parseInt(projectId) }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to generate proposal')
      } else {
        setProposal(data.proposal)
      }
    } catch {
      setError('Server error. Make sure backend is running.')
    }
    setLoading(false)
  }

  const totalCost = proposal?.cost?.reduce((sum, item) => sum + item.amount, 0) || 0

  return (
    <div className="max-w-3xl mx-auto">

      {/* Generate section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Project proposal</h1>
        <p className="text-sm text-gray-400 mb-5">
          AI-generated scope, timeline and cost breakdown
        </p>

        <div className="flex gap-3">
          <input
            type="number"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            placeholder="Enter your project ID (e.g. 1)"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
          />
          <button
            onClick={generateProposal}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : '✦ Generate with AI'}
          </button>
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Claude is generating your proposal... ✦
          </div>
        )}
      </div>

      {/* Proposal output */}
      {proposal && (
        <div className="flex flex-col gap-5">

          {/* Tech stack */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Recommended tech stack
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(proposal.stack || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 capitalize mb-1">{key}</div>
                  <div className="text-sm font-semibold text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scope of work */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Scope of work
            </div>
            <div className="flex flex-col gap-2">
              {(proposal.scope || []).map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="text-sm text-gray-700">{item}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Project timeline
            </div>
            <div className="flex flex-col gap-3">
              {(proposal.timeline || []).map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-xs font-semibold text-blue-600 flex-shrink-0">
                    {item.week}
                  </div>
                  <div className="flex-1 h-px bg-gray-100" />
                  <div className="text-sm text-gray-700">{item.task}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Cost breakdown
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              {(proposal.cost || []).map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-green-100 last:border-none text-sm">
                  <span className="text-gray-700">{item.item}</span>
                  <span className="font-semibold text-gray-800">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3 text-sm font-bold">
                <span className="text-gray-900">Total estimate</span>
                <span className="text-green-700 text-base">
                  ₹{totalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Preview PDF
            </button>
            <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
              Download PDF
            </button>
          </div>

        </div>
      )}
    </div>
  )
}