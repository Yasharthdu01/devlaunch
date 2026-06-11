'use client'
import { useState, useEffect } from 'react'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

const COLUMNS = [
  { id: 'todo',        label: 'To do',       color: 'var(--bg-tertiary)' },
  { id: 'in_progress', label: 'In progress', color: '#eff6ff'            },
  { id: 'done',        label: 'Done',        color: '#f0fdf4'            },
]

const TYPE_COLORS: Record<string, { bg: string; fg: string }> = {
  feature: { bg: '#dbeafe', fg: '#1d4ed8' },
  bug:     { bg: '#fee2e2', fg: '#b91c1c' },
  design:  { bg: '#f3e8ff', fg: '#7e22ce' },
  backend: { bg: '#dcfce7', fg: '#15803d' },
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

  const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' } as const

  return (
    <Box sx={{ display: 'flex', gap: 2.5, height: '100%', minHeight: 0, width: '100%', flexDirection: { xs: 'column', lg: 'row' } }}>

      {/* Kanban board */}
      <Box sx={{ flex: 1, minWidth: 0 }}>

        {/* Project selector */}
        {projects.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {projects.map(p => (
              <Button
                key={p.id}
                onClick={() => setSelectedId(String(p.id))}
                disableElevation
                variant={String(p.id) === selectedId ? 'contained' : 'outlined'}
                sx={{
                  fontSize: '0.75rem',
                  borderRadius: '8px',
                  textTransform: 'none',
                  py: 0.5,
                  ...(String(p.id) === selectedId
                    ? { bgcolor: 'var(--blue)', color: '#fff', '&:hover': { bgcolor: 'var(--blue-dark)' } }
                    : { borderColor: 'var(--border)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--blue-light)' } }),
                }}
              >
                {p.title}
              </Button>
            ))}
          </Box>
        )}

        {/* Kanban columns */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
          {COLUMNS.map(col => (
            <Box key={col.id} sx={{ bgcolor: col.color, borderRadius: '12px', p: 1.5, minWidth: 0 }}>

              {/* Column header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ ...labelSx, color: 'var(--text-secondary)' }}>
                  {col.label}
                </Typography>
                <Chip
                  label={tasksByStatus(col.id).length}
                  size="small"
                  sx={{ height: 20, bgcolor: 'var(--bg-primary)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}
                />
              </Box>

              {/* Tasks */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
                {tasksByStatus(col.id).map(task => {
                  const tc = TYPE_COLORS[task.type] || TYPE_COLORS.feature
                  const isSelected = selectedTask?.id === task.id
                  return (
                    <Paper
                      key={task.id}
                      elevation={0}
                      onClick={() => setSelectedTask(task)}
                      sx={{
                        bgcolor: 'var(--bg-primary)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--blue-light)' : 'var(--border)',
                        boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        borderRadius: '12px',
                        p: 1.5,
                        cursor: 'pointer',
                        minWidth: 0,
                        '&:hover': { borderColor: isSelected ? 'var(--blue-light)' : 'var(--text-muted)' },
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', mb: 1, lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, minWidth: 0 }}>
                        <Chip
                          label={task.type}
                          size="small"
                          sx={{ height: 20, bgcolor: tc.bg, color: tc.fg, fontSize: '0.7rem', fontWeight: 500, textTransform: 'capitalize', flexShrink: 0 }}
                        />
                        {task.assigned_to && (
                          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.assigned_to}
                          </Typography>
                        )}
                      </Box>

                      {/* Move buttons */}
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                        {col.id !== 'todo' && (
                          <Button
                            onClick={e => { e.stopPropagation(); moveTask(task.id, col.id === 'in_progress' ? 'todo' : 'in_progress') }}
                            disableElevation
                            sx={{ minWidth: 'auto', fontSize: '0.7rem', px: 1, py: 0.25, bgcolor: 'var(--bg-tertiary)', color: 'var(--text-muted)', borderRadius: '6px', textTransform: 'none', '&:hover': { bgcolor: 'var(--border)' } }}
                          >
                            ← Move back
                          </Button>
                        )}
                        {col.id !== 'done' && (
                          <Button
                            onClick={e => { e.stopPropagation(); moveTask(task.id, col.id === 'todo' ? 'in_progress' : 'done') }}
                            disableElevation
                            sx={{ minWidth: 'auto', fontSize: '0.7rem', px: 1, py: 0.25, bgcolor: '#dbeafe', color: '#1d4ed8', borderRadius: '6px', textTransform: 'none', '&:hover': { bgcolor: '#bfdbfe' } }}
                          >
                            Move forward →
                          </Button>
                        )}
                        <Button
                          onClick={e => { e.stopPropagation(); deleteTask(task.id) }}
                          disableElevation
                          sx={{ minWidth: 'auto', fontSize: '0.7rem', px: 1, py: 0.25, bgcolor: '#fef2f2', color: '#f87171', borderRadius: '6px', textTransform: 'none', ml: 'auto', '&:hover': { bgcolor: '#fee2e2' } }}
                        >
                          ×
                        </Button>
                      </Box>
                    </Paper>
                  )
                })}
              </Box>

              {/* Add task */}
              {showAddTask && addingTo === col.id ? (
                <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--blue-light)', borderRadius: '12px', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    autoFocus
                    value={newTask.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, title: e.target.value })}
                    onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addTask(col.id)}
                    placeholder="Task title..."
                    size="small"
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      value={newTask.assigned_to}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                      placeholder="Assign to..."
                      size="small"
                      sx={{ flex: 1, minWidth: 0, '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
                    />
                    <TextField
                      select
                      value={newTask.type}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, type: e.target.value })}
                      size="small"
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
                    >
                      <MenuItem value="feature">Feature</MenuItem>
                      <MenuItem value="bug">Bug</MenuItem>
                      <MenuItem value="design">Design</MenuItem>
                      <MenuItem value="backend">Backend</MenuItem>
                    </TextField>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      onClick={() => addTask(col.id)}
                      disabled={loading}
                      variant="contained"
                      disableElevation
                      sx={{ flex: 1, py: 0.75, bgcolor: 'var(--blue)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, borderRadius: '8px', textTransform: 'none', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
                    >
                      {loading ? '...' : 'Add task'}
                    </Button>
                    <Button
                      onClick={() => { setShowAddTask(false); setAddingTo('') }}
                      variant="outlined"
                      sx={{ px: 1.5, py: 0.75, borderColor: 'var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', borderRadius: '8px', textTransform: 'none', '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' } }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Button
                  onClick={() => { setShowAddTask(true); setAddingTo(col.id) }}
                  fullWidth
                  sx={{ py: 1, fontSize: '0.75rem', color: 'var(--text-muted)', borderRadius: '8px', textTransform: 'none', border: '1px dashed var(--border)', '&:hover': { color: 'var(--blue)', bgcolor: 'var(--bg-primary)', borderColor: 'var(--blue-light)' } }}
                >
                  + Add task
                </Button>
              )}

            </Box>
          ))}
        </Box>
      </Box>

      {/* Task detail panel */}
      {selectedTask && (
        <Paper
          elevation={0}
          sx={{
            width: { xs: '100%', lg: 288 },
            flexShrink: 0,
            bgcolor: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
        >

          <Box>
            <Typography sx={{ ...labelSx, mb: 1 }}>Task details</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', mb: 1, wordBreak: 'break-word' }}>
              {selectedTask.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={selectedTask.type}
                size="small"
                sx={{ height: 20, bgcolor: (TYPE_COLORS[selectedTask.type] || TYPE_COLORS.feature).bg, color: (TYPE_COLORS[selectedTask.type] || TYPE_COLORS.feature).fg, fontSize: '0.7rem', fontWeight: 500, textTransform: 'capitalize' }}
              />
              <Chip
                label={selectedTask.status.replace('_', ' ')}
                size="small"
                sx={{ height: 20, bgcolor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 500, textTransform: 'capitalize' }}
              />
            </Box>
          </Box>

          {selectedTask.assigned_to && (
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mb: 1 }}>Assigned to</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700 }}>
                  {selectedTask.assigned_to[0].toUpperCase()}
                </Avatar>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedTask.assigned_to}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Move task */}
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mb: 1 }}>Move to</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {COLUMNS.map(col => {
                const active = selectedTask.status === col.id
                return (
                  <Button
                    key={col.id}
                    onClick={() => moveTask(selectedTask.id, col.id)}
                    disabled={active}
                    disableElevation
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      py: 0.75,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      borderRadius: '8px',
                      textTransform: 'none',
                      ...(active
                        ? { bgcolor: 'var(--blue)', color: '#fff', '&.Mui-disabled': { bgcolor: 'var(--blue)', color: '#fff' } }
                        : { bgcolor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', '&:hover': { bgcolor: 'var(--border)' } }),
                    }}
                  >
                    {col.label}
                  </Button>
                )
              })}
            </Box>
          </Box>

          {/* Comments */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ ...labelSx, mb: 1.5 }}>
              Comments ({comments.length})
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 1.5 }}>
              {comments.length === 0 ? (
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', py: 1 }}>
                  No comments yet
                </Typography>
              ) : (
                comments.map(c => (
                  <Box key={c.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#f3e8ff', color: '#7e22ce', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {(c.name || 'U')[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{c.name || 'You'}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25, lineHeight: 1.5, wordBreak: 'break-word' }}>{c.content}</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                value={newComment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addComment()}
                placeholder="Add comment..."
                size="small"
                sx={{ flex: 1, minWidth: 0, '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
              />
              <Button
                onClick={addComment}
                disabled={!newComment.trim()}
                variant="contained"
                disableElevation
                sx={{ px: 1.5, bgcolor: 'var(--blue)', color: '#fff', fontSize: '0.75rem', borderRadius: '8px', textTransform: 'none', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
              >
                Send
              </Button>
            </Box>
          </Box>

          <Button
            onClick={() => setSelectedTask(null)}
            variant="outlined"
            fullWidth
            sx={{ py: 1, fontSize: '0.75rem', color: 'var(--text-muted)', borderColor: 'var(--border)', borderRadius: '8px', textTransform: 'none', '&:hover': { color: 'var(--text-secondary)', bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' } }}
          >
            Close panel
          </Button>

        </Paper>
      )}

    </Box>
  )
}
