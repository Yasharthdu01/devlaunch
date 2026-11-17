const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const wizardRoutes = require('./routes/wizard')
const aiRoutes = require('./routes/ai')
const chatRoutes = require('./routes/chat')
const proposalRoutes = require('./routes/proposals')
const projectRoutes = require('./routes/projects')
const milestoneRoutes = require('./routes/milestones')
const taskRoutes = require('./routes/tasks')
const adminRoutes = require('./routes/admin')
const marketingRoutes = require('./routes/marketing')
const supportRoutes = require('./routes/support')
const mvpRoutes = require('./routes/mvp')
const enquiryRoutes = require('./routes/enquiry')
const auditRoutes = require('./routes/audit')
const whatsappRoutes = require('./routes/whatsapp')
const orgRoutes = require('./routes/orgs')
const invitationRoutes = require('./routes/invitations')
const platformRoutes = require('./routes/platform')

// Allowed frontend origins come from env so a new Vercel domain doesn't need a code change.
// CORS_ORIGINS is comma-separated; FRONTEND_URL is kept for backwards compatibility.
const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'https://devlaunch-sand-gamma.vercel.app',
  'https://devlaunch-iota.vercel.app',
]

function allowedOrigins() {
  return [
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : DEFAULT_ORIGINS),
    process.env.FRONTEND_URL || '',
  ]
    .map(o => o.trim().replace(/\/$/, ''))
    .filter(Boolean)
}

function createApp() {
  const app = express()
  app.set('trust proxy', 1) // behind Railway's proxy; needed for per-IP rate limiting

  app.use(
    cors({
      origin: allowedOrigins(),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Org-Id'],
    })
  )
  app.use(express.json({ limit: '100kb' }))

  app.get('/', (req, res) => {
    res.json({
      message: 'DevLaunch API running',
      environment: process.env.NODE_ENV || 'development',
      version: '1.2.0',
    })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/wizard', wizardRoutes)
  app.use('/api/ai', aiRoutes)
  app.use('/api/chat', chatRoutes)
  app.use('/api/proposals', proposalRoutes)
  app.use('/api/projects', projectRoutes)
  app.use('/api/milestones', milestoneRoutes)
  app.use('/api/tasks', taskRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/marketing', marketingRoutes)
  app.use('/api/support', supportRoutes)
  app.use('/api/mvp', mvpRoutes)
  app.use('/api/enquiry', enquiryRoutes)
  app.use('/api/audit', auditRoutes)
  app.use('/api/whatsapp', whatsappRoutes)
  app.use('/api/orgs', orgRoutes)
  app.use('/api/invitations', invitationRoutes)
  app.use('/api/platform', platformRoutes)

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
  })

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ message: 'Malformed JSON body' })
    }
    console.error(err.stack)
    res.status(500).json({ message: 'Internal server error' })
  })

  return app
}

module.exports = { createApp, allowedOrigins }
