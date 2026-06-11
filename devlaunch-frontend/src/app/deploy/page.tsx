'use client'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import LinearProgress from '@mui/material/LinearProgress'
import Link from 'next/link'

interface DeployStep {
  id:      number
  label:   string
  detail:  string
  status:  'waiting' | 'running' | 'done' | 'error'
}

const INITIAL_STEPS: DeployStep[] = [
  { id: 1, label: 'Running tests',             detail: 'npm run test — checking all test suites',       status: 'waiting' },
  { id: 2, label: 'Building frontend',         detail: 'next build — optimizing for production',        status: 'waiting' },
  { id: 3, label: 'Deploying to Vercel',       detail: 'Pushing to Vercel edge network',                status: 'waiting' },
  { id: 4, label: 'Starting backend server',   detail: 'Node.js starting on Railway',                   status: 'waiting' },
  { id: 5, label: 'Connecting database',       detail: 'PostgreSQL connection pool established',         status: 'waiting' },
  { id: 6, label: 'Running DB migrations',     detail: 'Applying pending schema migrations',            status: 'waiting' },
  { id: 7, label: 'Configuring domain',        detail: 'Setting up custom domain + SSL certificate',    status: 'waiting' },
  { id: 8, label: 'Health check',              detail: 'Verifying all endpoints responding correctly',  status: 'waiting' },
]

const DEPLOY_LOGS = [
  '> Running test suites...',
  '✓ 47 tests passed in 3.2s',
  '> Building Next.js application...',
  '✓ Compiled successfully — 2.3MB bundle',
  '> Deploying to Vercel edge network...',
  '✓ Frontend live at devlaunch.vercel.app',
  '> Starting Node.js server on Railway...',
  '✓ Server running on port 5000',
  '> Connecting to PostgreSQL on Neon.tech...',
  '✓ Database connected — pool size: 10',
  '> Running 3 pending migrations...',
  '✓ All migrations applied successfully',
  '> Configuring domain devlaunch.in...',
  '✓ SSL certificate issued via Let\'s Encrypt',
  '> Running health checks...',
  '✓ All 8 endpoints responding correctly',
  '',
  '🎉 Deployment successful!',
  '🌐 Live at: https://devlaunch.in',
]

const FRONTEND_OPTIONS = ['Vercel', 'Netlify', 'AWS Amplify']
const BACKEND_OPTIONS = ['Railway', 'AWS EC2', 'Render', 'Heroku']
const DATABASE_OPTIONS = ['Neon.tech (PostgreSQL)', 'AWS RDS', 'PlanetScale (MySQL)', 'MongoDB Atlas']

export default function DeployPage() {
  const [steps,     setSteps]     = useState<DeployStep[]>(INITIAL_STEPS)
  const [logs,      setLogs]      = useState<string[]>([])
  const [deploying, setDeploying] = useState(false)
  const [done,      setDone]      = useState(false)
  const [config, setConfig] = useState({
    frontend: 'Vercel',
    backend:  'Railway',
    database: 'Neon.tech (PostgreSQL)',
    domain:   'devlaunch.in',
  })

  function handleConfigChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConfig({ ...config, [e.target.name]: e.target.value })
  }

  async function startDeploy() {
    setDeploying(true)
    setDone(false)
    setLogs([])
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'waiting' })))

    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } : s
      ))
      const logIdx = i * 2
      await delay(600)
      setLogs(prev => [...prev, DEPLOY_LOGS[logIdx] || ''])
      await delay(800)
      setLogs(prev => [...prev, DEPLOY_LOGS[logIdx + 1] || ''])
      await delay(400)
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'done' } : s
      ))
    }

    await delay(300)
    setLogs(prev => [...prev, '', DEPLOY_LOGS[16], DEPLOY_LOGS[17], DEPLOY_LOGS[18]])
    setDone(true)
    setDeploying(false)
  }

  function reset() {
    setSteps(INITIAL_STEPS)
    setLogs([])
    setDone(false)
    setDeploying(false)
  }

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const doneCount = steps.filter(s => s.status === 'done').length
  const progress  = Math.round((doneCount / steps.length) * 100)

  const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' } as const
  const fieldLabelSx = { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 } as const

  return (
    <Box sx={{ maxWidth: 896, mx: 'auto', width: '100%' }}>

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Deployment</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.25 }}>
          Deploy your project to production with one click
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 2.5 }}>

        {/* Config */}
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
          <Typography sx={{ ...labelSx, mb: 2 }}>Deployment config</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography sx={fieldLabelSx}>Frontend hosting</Typography>
              <TextField
                select
                name="frontend"
                value={config.frontend}
                onChange={handleConfigChange}
                disabled={deploying}
                size="small"
                fullWidth
              >
                {FRONTEND_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            </Box>
            <Box>
              <Typography sx={fieldLabelSx}>Backend hosting</Typography>
              <TextField
                select
                name="backend"
                value={config.backend}
                onChange={handleConfigChange}
                disabled={deploying}
                size="small"
                fullWidth
              >
                {BACKEND_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            </Box>
            <Box>
              <Typography sx={fieldLabelSx}>Database</Typography>
              <TextField
                select
                name="database"
                value={config.database}
                onChange={handleConfigChange}
                disabled={deploying}
                size="small"
                fullWidth
              >
                {DATABASE_OPTIONS.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            </Box>
            <Box>
              <Typography sx={fieldLabelSx}>Custom domain</Typography>
              <TextField
                name="domain"
                value={config.domain}
                onChange={handleConfigChange}
                disabled={deploying}
                size="small"
                fullWidth
              />
            </Box>
          </Box>

          {!deploying && !done && (
            <Button
              onClick={startDeploy}
              fullWidth
              variant="contained"
              disableElevation
              sx={{ mt: 2, py: 1.25, bgcolor: 'var(--blue)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, borderRadius: '12px', textTransform: 'none', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
            >
              🚀 Deploy to production
            </Button>
          )}

          {done && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', px: 2, py: 1.5, textAlign: 'center' }}>
                <Typography sx={{ color: '#15803d', fontWeight: 700, fontSize: '0.875rem', mb: 0.5 }}>
                  🎉 Deployment successful!
                </Typography>
                <Typography
                  component={Link}
                  href={`https://${config.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ fontSize: '0.75rem', color: 'var(--blue)', textDecoration: 'underline' }}
                >
                  {config.domain}
                </Typography>
              </Box>
              <Button
                onClick={reset}
                fullWidth
                variant="outlined"
                sx={{ py: 1, borderColor: 'var(--border)', color: 'var(--text-secondary)', fontSize: '0.875rem', borderRadius: '12px', textTransform: 'none', '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' } }}
              >
                Deploy again
              </Button>
            </Box>
          )}
        </Paper>

        {/* Steps */}
        <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={labelSx}>Deploy pipeline</Typography>
            {deploying && (
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 600, animation: 'pulse 1.5s ease-in-out infinite' }}>
                {progress}% complete
              </Typography>
            )}
            {done && (
              <Typography sx={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                100% ✓
              </Typography>
            )}
          </Box>

          {(deploying || done) && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: '9999px',
                bgcolor: 'var(--bg-tertiary)',
                mb: 2,
                '& .MuiLinearProgress-bar': { bgcolor: 'var(--blue)', borderRadius: '9999px' },
              }}
            />
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {steps.map(step => {
              const circleSx =
                step.status === 'done'    ? { bgcolor: '#22c55e', color: '#fff' } :
                step.status === 'running' ? { bgcolor: 'var(--blue)', color: '#fff', animation: 'pulse 1.5s ease-in-out infinite' } :
                { bgcolor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }
              const labelColor =
                step.status === 'done'    ? '#16a34a' :
                step.status === 'running' ? 'var(--blue)' :
                'var(--text-muted)'
              return (
                <Box key={step.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, mt: 0.25, ...circleSx }}>
                    {step.status === 'done' ? '✓' :
                     step.status === 'running' ? '⟳' :
                     step.id}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: labelColor }}>
                      {step.label}
                    </Typography>
                    {(step.status === 'running' || step.status === 'done') && (
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25 }}>{step.detail}</Typography>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Paper>

      </Box>

      {/* Deploy log */}
      {logs.length > 0 && (
        <Paper elevation={0} sx={{ bgcolor: '#111827', borderRadius: '16px', p: 2.5, mb: 2.5 }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
            Deploy log
          </Typography>
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 1.6, maxHeight: 192, overflowY: 'auto' }}>
            {logs.map((log, i) => (
              <Box
                key={i}
                sx={{
                  color:
                    log.includes('✓') || log.includes('🎉') || log.includes('🌐')
                      ? '#4ade80'
                      : log.startsWith('>')
                      ? '#60a5fa'
                      : '#d1d5db',
                }}
              >
                {log || ' '}
              </Box>
            ))}
            {deploying && (
              <Box sx={{ color: '#6b7280', animation: 'pulse 1.5s ease-in-out infinite' }}>▋</Box>
            )}
          </Box>
        </Paper>
      )}

      {/* Env variables */}
      <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
        <Typography sx={{ ...labelSx, mb: 2 }}>Environment variables (production)</Typography>
        <Box sx={{ bgcolor: '#111827', borderRadius: '12px', p: 2, fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 2, overflowX: 'auto' }}>
          <Box><Box component="span" sx={{ color: '#60a5fa' }}>NEXT_PUBLIC_API_URL</Box>=<Box component="span" sx={{ color: '#4ade80' }}>https://api.{config.domain}</Box></Box>
          <Box><Box component="span" sx={{ color: '#60a5fa' }}>DATABASE_URL</Box>=<Box component="span" sx={{ color: '#4ade80' }}>postgresql://***@neon.tech/devlaunch</Box></Box>
          <Box><Box component="span" sx={{ color: '#60a5fa' }}>JWT_SECRET</Box>=<Box component="span" sx={{ color: '#4ade80' }}>your_production_secret_here</Box></Box>
          <Box><Box component="span" sx={{ color: '#60a5fa' }}>OLLAMA_URL</Box>=<Box component="span" sx={{ color: '#4ade80' }}>https://your-ollama-server.com</Box></Box>
          <Box><Box component="span" sx={{ color: '#60a5fa' }}>NODE_ENV</Box>=<Box component="span" sx={{ color: '#4ade80' }}>production</Box></Box>
        </Box>
      </Paper>

    </Box>
  )
}
