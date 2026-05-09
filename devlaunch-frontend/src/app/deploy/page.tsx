'use client'
import { useState } from 'react'

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

  function handleConfigChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setConfig({ ...config, [e.target.name]: e.target.value })
  }

  async function startDeploy() {
    setDeploying(true)
    setDone(false)
    setLogs([])
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'waiting' })))

    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      // Set step to running
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } : s
      ))

      // Add 2 log lines per step
      const logIdx = i * 2
      await delay(600)
      setLogs(prev => [...prev, DEPLOY_LOGS[logIdx] || ''])
      await delay(800)
      setLogs(prev => [...prev, DEPLOY_LOGS[logIdx + 1] || ''])
      await delay(400)

      // Set step to done
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'done' } : s
      ))
    }

    // Final logs
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

  return (
    <div className="max-w-3xl mx-auto">

      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">Deployment</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Deploy your project to production with one click
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">

        {/* Config */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Deployment config
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Frontend hosting
              </label>
              <select
                name="frontend"
                value={config.frontend}
                onChange={handleConfigChange}
                disabled={deploying}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white disabled:opacity-50"
              >
                <option>Vercel</option>
                <option>Netlify</option>
                <option>AWS Amplify</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Backend hosting
              </label>
              <select
                name="backend"
                value={config.backend}
                onChange={handleConfigChange}
                disabled={deploying}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white disabled:opacity-50"
              >
                <option>Railway</option>
                <option>AWS EC2</option>
                <option>Render</option>
                <option>Heroku</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Database
              </label>
              <select
                name="database"
                value={config.database}
                onChange={handleConfigChange}
                disabled={deploying}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white disabled:opacity-50"
              >
                <option>Neon.tech (PostgreSQL)</option>
                <option>AWS RDS</option>
                <option>PlanetScale (MySQL)</option>
                <option>MongoDB Atlas</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Custom domain
              </label>
              <input
                name="domain"
                value={config.domain}
                onChange={handleConfigChange}
                disabled={deploying}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {!deploying && !done && (
            <button
              onClick={startDeploy}
              className="mt-4 w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              🚀 Deploy to production
            </button>
          )}

          {done && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
                <div className="text-green-700 font-bold text-sm mb-1">
                  🎉 Deployment successful!
                </div>
                <a
                  href={`https://${config.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 underline"
                >
                  {config.domain}
                </a>
              </div>
              <button
                onClick={reset}
                className="w-full py-2 border border-gray-300 text-sm text-gray-600 rounded-xl hover:bg-gray-50"
              >
                Deploy again
              </button>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Deploy pipeline
            </div>
            {deploying && (
              <span className="text-xs text-blue-600 font-semibold animate-pulse">
                {progress}% complete
              </span>
            )}
            {done && (
              <span className="text-xs text-green-600 font-semibold">
                100% ✓
              </span>
            )}
          </div>

          {/* Progress bar */}
          {(deploying || done) && (
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {steps.map(step => (
              <div key={step.id} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-all
                  ${step.status === 'done'    ? 'bg-green-500 text-white' :
                    step.status === 'running' ? 'bg-blue-500 text-white animate-pulse' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                  {step.status === 'done' ? '✓' :
                   step.status === 'running' ? '⟳' :
                   step.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold transition-colors
                    ${step.status === 'done'    ? 'text-green-700' :
                      step.status === 'running' ? 'text-blue-600' :
                      'text-gray-400'
                    }`}>
                    {step.label}
                  </div>
                  {(step.status === 'running' || step.status === 'done') && (
                    <div className="text-xs text-gray-400 mt-0.5">{step.detail}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Deploy log */}
      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Deploy log
          </div>
          <div className="font-mono text-xs leading-relaxed max-h-48 overflow-y-auto">
            {logs.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('✓') || log.includes('🎉') || log.includes('🌐')
                    ? 'text-green-400'
                    : log.startsWith('>')
                    ? 'text-blue-400'
                    : 'text-gray-300'
                }
              >
                {log || '\u00A0'}
              </div>
            ))}
            {deploying && (
              <div className="text-gray-500 animate-pulse">▋</div>
            )}
          </div>
        </div>
      )}

      {/* Env variables */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Environment variables (production)
        </div>
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs leading-loose">
          <div><span className="text-blue-400">NEXT_PUBLIC_API_URL</span>=<span className="text-green-400">https://api.{config.domain}</span></div>
          <div><span className="text-blue-400">DATABASE_URL</span>=<span className="text-green-400">postgresql://***@neon.tech/devlaunch</span></div>
          <div><span className="text-blue-400">JWT_SECRET</span>=<span className="text-green-400">your_production_secret_here</span></div>
          <div><span className="text-blue-400">OLLAMA_URL</span>=<span className="text-green-400">https://your-ollama-server.com</span></div>
          <div><span className="text-blue-400">NODE_ENV</span>=<span className="text-green-400">production</span></div>
        </div>
      </div>

    </div>
  )
}