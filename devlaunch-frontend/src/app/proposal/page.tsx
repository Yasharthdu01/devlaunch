'use client'
import { useState } from 'react'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'

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
      const res = await fetch(API_URL + '/api/proposals/generate', {
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

  const totalCost = proposal?.cost?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0

  const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 } as const

  return (
    <Box sx={{ maxWidth: 768, mx: 'auto', width: '100%' }}>

      {/* Generate section */}
      <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 3, mb: 3 }}>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>
          Project proposal
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mb: 2.5 }}>
          AI-generated scope, timeline and cost breakdown
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            type="number"
            value={projectId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectId(e.target.value)}
            placeholder="Enter your project ID (e.g. 1)"
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            onClick={generateProposal}
            disabled={loading}
            variant="contained"
            disableElevation
            sx={{ bgcolor: 'var(--blue)', color: '#fff', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2.5, whiteSpace: 'nowrap', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
          >
            {loading ? 'Generating...' : '✦ Generate with AI'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ borderRadius: '8px', mt: 1.5 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Typography sx={{ mt: 2, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Claude is generating your proposal... ✦
          </Typography>
        )}
      </Paper>

      {/* Proposal output */}
      {proposal && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pb: 5 }}>

          {/* Tech stack */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={labelSx}>Recommended tech stack</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
              {Object.entries(proposal.stack || {}).map(([key, value]: [string, any]) => (
                <Box key={key} sx={{ bgcolor: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '12px', p: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', mb: 0.5 }}>
                    {key}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Scope of work */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={labelSx}>Scope of work</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(proposal.scope || []).map((item: string, i: number) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, mt: 0.25 }}>
                    {i + 1}
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Timeline */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={labelSx}>Project timeline</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {(proposal.timeline || []).map((item: any, i: number) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ width: 96, fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue)', flexShrink: 0 }}>
                    {item.week}
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'var(--border)' }} />
                  <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.task}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Cost breakdown */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={labelSx}>Cost breakdown</Typography>
            <Box sx={{ bgcolor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', p: 2 }}>
              {(proposal.cost || []).map((item: any, i: number) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    borderBottom: i === (proposal.cost.length - 1) ? 'none' : '1px solid #dcfce7',
                  }}
                >
                  <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.item}</Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    ₹{item.amount.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, pt: 1.5 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Total estimate</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#16a34a', whiteSpace: 'nowrap' }}>
                  ₹{totalCost.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              disableElevation
              sx={{ flex: 1, minWidth: 140, py: 1.25, borderColor: 'var(--border)', color: 'var(--text-secondary)', borderRadius: '12px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' } }}
            >
              Preview PDF
            </Button>
            <Button
              variant="contained"
              disableElevation
              sx={{ flex: 1, minWidth: 140, py: 1.25, bgcolor: 'var(--blue)', color: '#fff', borderRadius: '12px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'var(--blue-dark)' } }}
            >
              Download PDF
            </Button>
          </Box>

        </Box>
      )}
    </Box>
  )
}
