const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')

router.post('/generate', authMiddleware, async (req, res) => {
  const { idea } = req.body

  const prompt = `You are a software architect. A client wants to build: "${idea}"

Return ONLY this JSON, no extra text, no markdown:
{
  "app_name": "short app name",
  "tagline": "one line description",
  "features": [
    "Feature 1 description",
    "Feature 2 description",
    "Feature 3 description",
    "Feature 4 description",
    "Feature 5 description",
    "Feature 6 description"
  ],
  "pages": [
    "Home / Landing page",
    "User login and register",
    "Dashboard",
    "Core feature page",
    "Profile page",
    "Admin panel"
  ],
  "stack": {
    "frontend": "Next.js 14",
    "backend": "Node.js + Express",
    "database": "PostgreSQL",
    "auth": "JWT + bcrypt",
    "hosting": "Vercel + Railway"
  },
  "timeline": [
    {"phase": "Week 1-2",  "task": "UI/UX Design + Setup"},
    {"phase": "Week 3-5",  "task": "Frontend Development"},
    {"phase": "Week 5-8",  "task": "Backend + APIs"},
    {"phase": "Week 8-9",  "task": "Testing + QA"},
    {"phase": "Week 9-10", "task": "Deployment + Launch"}
  ],
  "cost": {
    "min": 150000,
    "max": 350000,
    "currency": "INR"
  },
  "complexity": "medium"
}`

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt,
        stream: false,
        options: { temperature: 0.2 },
      }),
    })

    const aiData = await response.json()
    const text = aiData.response

    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON')

    const parsed = JSON.parse(text.substring(start, end + 1))
    res.json(parsed)

  } catch (err) {
    console.error(err.message)
    // Fallback
    res.json({
      app_name: idea.split(' ').slice(0, 2).join(''),
      tagline: `A smart platform for ${idea}`,
      features: [
        'User authentication and profile management',
        'Core feature dashboard with real-time data',
        'Search and filter functionality',
        'Payment gateway integration (Razorpay)',
        'Admin panel for management',
        'Email and SMS notifications',
      ],
      pages: [
        'Home / Landing page',
        'Login and Register',
        'Main dashboard',
        'Feature detail page',
        'User profile',
        'Admin panel',
      ],
      stack: {
        frontend: 'Next.js 14',
        backend:  'Node.js + Express',
        database: 'PostgreSQL + Redis',
        auth:     'JWT + bcrypt',
        hosting:  'Vercel + Railway',
      },
      timeline: [
        { phase: 'Week 1-2',  task: 'UI/UX Design + Project Setup' },
        { phase: 'Week 3-5',  task: 'Frontend Development' },
        { phase: 'Week 5-8',  task: 'Backend APIs + Integrations' },
        { phase: 'Week 8-9',  task: 'Testing + QA' },
        { phase: 'Week 9-10', task: 'Deployment + Launch' },
      ],
      cost: { min: 150000, max: 350000, currency: 'INR' },
      complexity: 'medium',
    })
  }
})

module.exports = router