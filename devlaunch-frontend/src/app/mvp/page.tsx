'use client'
import { useState } from 'react'
import Link from 'next/link'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'

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

const COMPLEXITY_COLORS: Record<string, { bg: string; fg: string }> = {
  simple:  { bg: '#dcfce7', fg: '#15803d' },
  medium:  { bg: '#fef3c7', fg: '#b45309' },
  complex: { bg: '#fee2e2', fg: '#b91c1c' },
}

const EXAMPLE_IDEAS = [
  'Travel booking app for Varanasi tours',
  'Online doctor appointment system',
  'Multi-vendor e-commerce marketplace',
  'Student learning management system',
  'Restaurant food ordering platform',
  'Freelancer project management tool',
]

const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 } as const

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
      const res = await fetch(API_URL + '/api/mvp/generate', {
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
    <Box sx={{ maxWidth: 768, mx: 'auto', width: '100%' }}>

      {/* Hero input */}
      <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: '1.25rem' }}>⚡</Typography>
          <Typography component="h1" sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Build my MVP
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mb: 2.5 }}>
          Enter your app idea — AI instantly generates features, pages,
          tech stack, timeline and cost estimate
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            value={idea}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdea(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') generate() }}
            placeholder="e.g. Travel booking app for Varanasi tours..."
            size="small"
            sx={{
              flex: 1,
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                fontSize: '0.875rem',
              },
            }}
          />
          <Button
            onClick={generate}
            disabled={loading}
            variant="contained"
            disableElevation
            sx={{
              px: 2.5,
              bgcolor: 'var(--blue)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '12px',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              '&:hover': { bgcolor: 'var(--blue-dark)' },
            }}
          >
            {loading ? '⟳ Generating...' : '⚡ Generate MVP'}
          </Button>
        </Box>

        {/* Example ideas */}
        <Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mb: 1 }}>Try an example:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {EXAMPLE_IDEAS.map(ex => (
              <Chip
                key={ex}
                label={ex}
                onClick={() => setIdea(ex)}
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                  bgcolor: 'transparent',
                  '&:hover': { bgcolor: 'var(--blue-light)', color: 'var(--blue)', borderColor: 'var(--blue)' },
                }}
              />
            ))}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 1.5, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mb: 1 }}>
              AI is analyzing your idea...
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              {['Features', 'Pages', 'Stack', 'Timeline', 'Cost'].map((s, i) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  sx={{
                    fontSize: '0.75rem',
                    bgcolor: 'var(--blue-light)',
                    color: 'var(--blue)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 150}ms`,
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.4 },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Results */}
      {data && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* App header */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--blue)', borderRadius: '16px', p: 2.5, color: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 0.5 }}>{data.app_name}</Typography>
                <Typography sx={{ color: '#bfdbfe', fontSize: '0.875rem' }}>{data.tagline}</Typography>
              </Box>
              {(() => {
                const cc = COMPLEXITY_COLORS[data.complexity] || COMPLEXITY_COLORS.medium
                return (
                  <Chip
                    label={`${data.complexity} complexity`}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      flexShrink: 0,
                      bgcolor: cc.bg,
                      color: cc.fg,
                    }}
                  />
                )
              })()}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  ₹{Math.round(data.cost.min / 100000 * 10) / 10}L
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#bfdbfe' }}>Min cost</Typography>
              </Box>
              <Box sx={{ width: '1px', bgcolor: '#3b82f6' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  ₹{Math.round(data.cost.max / 100000 * 10) / 10}L
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#bfdbfe' }}>Max cost</Typography>
              </Box>
              <Box sx={{ width: '1px', bgcolor: '#3b82f6' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>10</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#bfdbfe' }}>Weeks</Typography>
              </Box>
              <Box sx={{ width: '1px', bgcolor: '#3b82f6' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>{data.features.length}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#bfdbfe' }}>Features</Typography>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.5 }}>

            {/* Features */}
            <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
              <Typography sx={labelSx}>Core features</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.features.map((f, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, mt: 0.25 }}>
                      {i + 1}
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Pages */}
            <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
              <Typography sx={labelSx}>Pages needed</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {data.pages.map((p, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: i === data.pages.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{p}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

          </Box>

          {/* Tech stack */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={labelSx}>Recommended tech stack</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
              {Object.entries(data.stack).map(([key, value]) => (
                <Box key={key} sx={{ bgcolor: 'var(--bg-tertiary)', borderRadius: '12px', p: 1.5, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', mb: 0.5 }}>{key}</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Timeline */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={labelSx}>Development timeline</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.timeline.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ width: 80, fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', flexShrink: 0 }}>
                    {item.phase}
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'var(--border)' }} />
                  <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.task}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* CTA */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>
                Ready to build this?
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Go through our 6-step wizard to get a detailed proposal
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/wizard"
              variant="contained"
              disableElevation
              sx={{
                px: 2.5,
                py: 1.25,
                bgcolor: 'var(--blue)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.875rem',
                borderRadius: '12px',
                textTransform: 'none',
                flexShrink: 0,
                '&:hover': { bgcolor: 'var(--blue-dark)' },
              }}
            >
              Start project →
            </Button>
          </Paper>

        </Box>
      )}
    </Box>
  )
}
