'use client'
import { useState, useEffect } from 'react'
import API_URL from '@/lib/config'

const COLUMNS = [
  { id: 'todo',        label: 'To do',       color: 'bg-gray-100' },
  { id: 'in_progress', label: 'In progress',  color: 'bg-blue-50'  },
  { id: 'done',        label: 'Done',         color: 'bg-green-50' },
]

const TYPE_COLORS = {
  feature: 'bg-blue-100 text-blue-700',
  bug:     'bg-red-100 text-red-700',
  design:  'bg-purple-100 text-purple-700',
  backend: 'bg-green-100 text-green-700',
}

export default function CollabPage() {
  const [projects,      setProjects]      = useState([])
  const [selectedId,    setSelectedId]    = useState('')
  const [tasks,         setTasks]         = useState([])
  const [selectedTask,  setSelectedTask]  = useState(null)
  const [comments,      setComments]      = useState([])
  const [newComment,    setNewComment]    = useState('')
  const [showAddTask,   setShowAddTask]   = useState(false)
  const [addingTo,      setAddingTo]      = useState('')
  const [newTask,       setNewTask]       = useState({ title: '', assigned_to: '', type: 'feature' })
  const [loading,       setLoading]       = useState(false)

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  useEffect(() => { fetchProjects() }, [])
  useEffect(() => { if (selectedId) fetchTasks() }, [selectedId])
  useEffect(() => { if (selectedTask) fetchComments(selectedTask.id) }, [selectedTask])

  async function fetchProjects() {
    try {
      const res = await fetch(API_URL + '/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setProjects(data)
      if (data.length > 0) setSelectedId(String(data[0].id))
    } catch {}
  }

  async function fetchTasks() {
    try {
      const res = await fetch(
        API_URL + `/api/tasks/${selectedId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch {}
  }

  async function fetchComments(taskId) {
    try {
      const res = await fetch(
        API_URL + `/api/tasks/${taskId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setComments(Array.isArray(data) ? data : [])
    } catch {}
  }

  async function addTask(status) {
    if (!newTask.title.trim()) return
    setLoading(true)
    try {
      const res = await fetch(API_URL + '/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id:  parseInt(selectedId),
          title:       newTask.title,
          assigned_to: newTask.assigned_to,
          type:        newTask.type,
          status,
        }),
      })
      const data = await res.json()
      setTasks(prev => [...prev, data])
      setNewTask({ title: '', assigned_to: '', type: 'feature' })
      setShowAddTask(false)
      setAddingTo('')
    } catch {}
    setLoading(false)
  }

  async function moveTask(taskId, newStatus) {
    try {
      const res = await fetch(API_URL + `/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      setTasks(prev => prev.map(t => t.id === taskId ? data : t))
      if (selectedTask?.id === taskId) setSelectedTask(data)
    } catch {}
  }

  async function deleteTask(taskId) {
    try {
      await fetch(API_URL + `/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(prev => prev.filter(t => t.id !== taskId))
      if (selectedTask?.id === taskId) setSelectedTask(null)
    } catch {}
  }

  async function addComment() {
    if (!newComment.trim() || !selectedTask) return
    try {
      const res = await fetch(
        API_URL + `/api/tasks/${selectedTask.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      )
      const data = await res.json()
      setComments(prev => [...prev, data])
      setNewComment('')
    } catch {}
  }

  const tasksByStatus = (status) =>
    tasks.filter(t => t.status === status)

  return (
    <div className="flex gap-5 h-full min-h-0">

      {/* Kanban board */}
      <div className="flex-1 min-w-0">

        {/* Project selector */}
        {projects.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {projects.map(p => (
              <button key={p.id}
                onClick={() => setSelectedId(String(p.id))}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors
                  ${String(p.id) === selectedId
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                  }`}>
                {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Kanban columns */}
        <div className="grid grid-cols-3 gap-4">
          {COLUMNS.map(col => (
            <div key={col.id} className={`${col.color} rounded-xl p-3`}>

              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-xs bg-white text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                  {tasksByStatus(col.id).length}
                </span>
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-2 mb-3">
                {tasksByStatus(col.id).map(task => (
                  <div key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`bg-white border rounded-xl p-3 cursor-pointer transition-all
                      ${selectedTask?.id === task.id
                        ? 'border-blue-400 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}>
                    <div className="text-xs font-semibold text-gray-800 mb-2 leading-relaxed">
                      {task.title}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${TYPE_COLORS[task.type] || TYPE_COLORS.feature}`}>
                        {task.type}
                      </span>
                      {task.assigned_to && (
                        <span className="text-xs text-gray-400">{task.assigned_to}</span>
                      )}
                    </div>

                    {/* Move buttons */}
                    <div className="flex gap-1 mt-2">
                      {col.id !== 'todo' && (
                        <button
                          onClick={e => { e.stopPropagation(); moveTask(task.id, col.id === 'in_progress' ? 'todo' : 'in_progress') }}
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200">
                          ← Move back
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button
                          onClick={e => { e.stopPropagation(); moveTask(task.id, col.id === 'todo' ? 'in_progress' : 'done') }}
                          className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
                          Move forward →
                        </button>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); deleteTask(task.id) }}
                        className="text-xs px-2 py-0.5 bg-red-50 text-red-400 rounded-md hover:bg-red-100 ml-auto">
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add task */}
              {showAddTask && addingTo === col.id ? (
                <div className="bg-white border border-blue-300 rounded-xl p-3 flex flex-col gap-2">
                  <input
                    autoFocus
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && addTask(col.id)}
                    placeholder="Task title..."
                    className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      value={newTask.assigned_to}
                      onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
                      placeholder="Assign to..."
                      className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg outline-none"
                    />
                    <select
                      value={newTask.type}
                      onChange={e => setNewTask({ ...newTask, type: e.target.value })}
                      className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg outline-none bg-white">
                      <option value="feature">Feature</option>
                      <option value="bug">Bug</option>
                      <option value="design">Design</option>
                      <option value="backend">Backend</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addTask(col.id)}
                      disabled={loading}
                      className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      {loading ? '...' : 'Add task'}
                    </button>
                    <button
                      onClick={() => { setShowAddTask(false); setAddingTo('') }}
                      className="px-3 py-1.5 border border-gray-200 text-xs rounded-lg text-gray-500 hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setShowAddTask(true); setAddingTo(col.id) }}
                  className="w-full py-2 text-xs text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-dashed border-gray-200 hover:border-blue-300">
                  + Add task
                </button>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Task detail panel */}
      {selectedTask && (
        <div className="w-72 flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto">

          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Task details
            </div>
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {selectedTask.title}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${TYPE_COLORS[selectedTask.type] || TYPE_COLORS.feature}`}>
                {selectedTask.type}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium capitalize">
                {selectedTask.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {selectedTask.assigned_to && (
            <div>
              <div className="text-xs text-gray-400 mb-1">Assigned to</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {selectedTask.assigned_to[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-700">{selectedTask.assigned_to}</span>
              </div>
            </div>
          )}

          {/* Move task */}
          <div>
            <div className="text-xs text-gray-400 mb-2">Move to</div>
            <div className="flex gap-1">
              {COLUMNS.map(col => (
                <button key={col.id}
                  onClick={() => moveTask(selectedTask.id, col.id)}
                  disabled={selectedTask.status === col.id}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors
                    ${selectedTask.status === col.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Comments ({comments.length})
            </div>

            <div className="flex flex-col gap-3 mb-3">
              {comments.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-2">
                  No comments yet
                </div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {(c.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-700">{c.name || 'You'}</div>
                      <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">{c.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()}
                placeholder="Add comment..."
                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Send
              </button>
            </div>
          </div>

          <button
            onClick={() => setSelectedTask(null)}
            className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg">
            Close panel
          </button>

        </div>
      )}

    </div>
  )
}