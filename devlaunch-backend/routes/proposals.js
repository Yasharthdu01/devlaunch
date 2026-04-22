// // const express = require('express')
// // const router = express.Router()
// // const pool = require('../db')
// // const Anthropic = require('@anthropic-ai/sdk')
// // const authMiddleware = require('../middleware/auth')
// // require('dotenv').config()

// // const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

// // // POST /api/proposals/generate
// // router.post('/generate', authMiddleware, async (req, res) => {
// //   const { project_id } = req.body

// //   try {
// //     // Get project details from DB
// //     const result = await pool.query(
// //       'SELECT * FROM projects WHERE id = $1 AND client_id = $2',
// //       [project_id, req.user.id]
// //     )

// //     if (result.rows.length === 0) {
// //       return res.status(404).json({ message: 'Project not found' })
// //     }

// //     const project = result.rows[0]

// //     const prompt = `Generate a professional software project proposal in JSON format for:

// // Project: ${project.title}
// // Description: ${project.description}
// // Budget: ₹${project.budget_min || 'Not specified'}
// // Timeline: ${project.timeline_weeks || 10} weeks
// // Requirements: ${JSON.stringify(project.requirements || {})}

// // Return ONLY valid JSON with this exact structure:
// // {
// //   "scope": ["item1", "item2", "item3", "item4", "item5"],
// //   "timeline": [
// //     {"week": "Weeks 1-2", "task": "Discovery & UI/UX Design"},
// //     {"week": "Weeks 3-5", "task": "Frontend Development"},
// //     {"week": "Weeks 5-8", "task": "Backend + API Development"},
// //     {"week": "Weeks 8-9", "task": "Testing & QA"},
// //     {"week": "Week 10",   "task": "Deployment & Handover"}
// //   ],
// //   "cost": [
// //     {"item": "UI/UX Design",           "amount": 45000},
// //     {"item": "Frontend Development",   "amount": 110000},
// //     {"item": "Backend Development",    "amount": 120000},
// //     {"item": "Database + Cloud Setup", "amount": 35000},
// //     {"item": "Testing & QA",           "amount": 30000},
// //     {"item": "Deployment + CI/CD",     "amount": 20000}
// //   ],
// //   "stack": {
// //     "frontend": "Next.js 14",
// //     "backend": "Node.js + Express",
// //     "database": "PostgreSQL",
// //     "cloud": "Vercel + Railway"
// //   },
// //   "total": 360000
// // }`

// //     const response = await client.messages.create({
// //       model: 'claude-sonnet-4-6',
// //       max_tokens: 1000,
// //       messages: [{ role: 'user', content: prompt }],
// //     })

// //     const text = response.content[0].text
// //     const jsonMatch = text.match(/\{[\s\S]*\}/)
// //     const proposalData = JSON.parse(jsonMatch[0])

// //     // Save proposal to DB
// //     const saved = await pool.query(
// //       `INSERT INTO proposals (project_id, scope, timeline, cost, stack, total)
// //        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
// //       [
// //         project_id,
// //         JSON.stringify(proposalData.scope),
// //         JSON.stringify(proposalData.timeline),
// //         JSON.stringify(proposalData.cost),
// //         JSON.stringify(proposalData.stack),
// //         proposalData.total,
// //       ]
// //     )

// //     res.json({ proposal: proposalData, id: saved.rows[0].id })

// //   } catch (err) {
// //     console.error(err.message)
// //     res.status(500).json({ message: 'Failed to generate proposal' })
// //   }
// // })

// // // GET /api/proposals/:project_id
// // router.get('/:project_id', authMiddleware, async (req, res) => {
// //   try {
// //     const result = await pool.query(
// //       'SELECT * FROM proposals WHERE project_id = $1 ORDER BY created_at DESC LIMIT 1',
// //       [req.params.project_id]
// //     )
// //     if (result.rows.length === 0) {
// //       return res.status(404).json({ message: 'No proposal found' })
// //     }
// //     res.json(result.rows[0])
// //   } catch (err) {
// //     res.status(500).json({ message: 'Server error' })
// //   }
// // })

// // module.exports = router


// const express = require('express')
// const router = express.Router()
// const pool = require('../db')
// const authMiddleware = require('../middleware/auth')
// require('dotenv').config()

// // POST /api/proposals/generate
// router.post('/generate', authMiddleware, async (req, res) => {
//   const { project_id } = req.body

//   try {
//     const result = await pool.query(
//       'SELECT * FROM projects WHERE id = $1 AND client_id = $2',
//       [project_id, req.user.id]
//     )

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Project not found' })
//     }

//     const project = result.rows[0]

//     const prompt = `Generate a software project proposal in JSON format only. No explanation, just JSON.

// Project: ${project.title}
// Description: ${project.description}
// Budget: ₹${project.budget_min || 300000}
// Timeline: ${project.timeline_weeks || 10} weeks

// Return ONLY this JSON structure, nothing else:
// {
//   "scope": ["item1", "item2", "item3", "item4", "item5"],
//   "timeline": [
//     {"week": "Weeks 1-2", "task": "Discovery & UI/UX Design"},
//     {"week": "Weeks 3-5", "task": "Frontend Development"},
//     {"week": "Weeks 5-8", "task": "Backend + API Development"},
//     {"week": "Weeks 8-9", "task": "Testing & QA"},
//     {"week": "Week 10",   "task": "Deployment & Handover"}
//   ],
//   "cost": [
//     {"item": "UI/UX Design",         "amount": 45000},
//     {"item": "Frontend Development", "amount": 110000},
//     {"item": "Backend Development",  "amount": 120000},
//     {"item": "Database + Cloud",     "amount": 35000},
//     {"item": "Testing & QA",         "amount": 30000},
//     {"item": "Deployment + CI/CD",   "amount": 20000}
//   ],
//   "stack": {
//     "frontend": "Next.js 14",
//     "backend": "Node.js + Express",
//     "database": "PostgreSQL",
//     "cloud": "Vercel + Railway"
//   },
//   "total": 360000
// }`

//     const response = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'llama3',
//         prompt,
//         stream: false,
//       }),
//     })

//     const aiData = await response.json()
//     const text = aiData.response

//     // Extract JSON from response
//     const jsonMatch = text.match(/\{[\s\S]*\}/)
//     if (!jsonMatch) {
//       return res.status(500).json({ message: 'AI did not return valid JSON. Try again.' })
//     }

//     const proposalData = JSON.parse(jsonMatch[0])

//     // Save to DB
//     const saved = await pool.query(
//       `INSERT INTO proposals (project_id, scope, timeline, cost, stack, total)
//        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
//       [
//         project_id,
//         JSON.stringify(proposalData.scope),
//         JSON.stringify(proposalData.timeline),
//         JSON.stringify(proposalData.cost),
//         JSON.stringify(proposalData.stack),
//         proposalData.total,
//       ]
//     )

//     res.json({ proposal: proposalData, id: saved.rows[0].id })

//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: 'Failed to generate proposal: ' + err.message })
//   }
// })

// // GET /api/proposals/:project_id
// router.get('/:project_id', authMiddleware, async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM proposals WHERE project_id = $1 ORDER BY created_at DESC LIMIT 1',
//       [req.params.project_id]
//     )
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'No proposal found' })
//     }
//     res.json(result.rows[0])
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// })

// module.exports = router

const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/auth')
require('dotenv').config()

// Helper function to extract valid JSON from AI response
function extractJSON(text) {
  // Try direct parse first
  try {
    return JSON.parse(text)
  } catch {}

  // Find the first { and last } and try parsing that
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) return null

  try {
    return JSON.parse(text.substring(start, end + 1))
  } catch {}

  // Try removing markdown code blocks
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  const start2 = cleaned.indexOf('{')
  const end2 = cleaned.lastIndexOf('}')
  if (start2 === -1 || end2 === -1) return null

  try {
    return JSON.parse(cleaned.substring(start2, end2 + 1))
  } catch {}

  return null
}

// Default proposal template as fallback
function getDefaultProposal(project) {
  return {
    scope: [
      'UI/UX design with Figma prototypes for all screens',
      'Full frontend development with responsive design',
      'Backend REST APIs with authentication and authorization',
      'Database design, setup and optimization',
      'Third-party integrations (payments, email, maps)',
      'Cloud deployment with CI/CD pipeline',
      '30 days post-launch support and bug fixes',
    ],
    timeline: [
      { week: 'Weeks 1-2',  task: 'Discovery & UI/UX Design' },
      { week: 'Weeks 3-5',  task: 'Frontend Development' },
      { week: 'Weeks 5-8',  task: 'Backend + API Development' },
      { week: 'Weeks 7-8',  task: 'Integrations & Testing' },
      { week: 'Weeks 9-10', task: 'QA, Deployment & Handover' },
    ],
    cost: [
      { item: 'UI/UX Design (Figma)',      amount: 45000  },
      { item: 'Frontend Development',       amount: 110000 },
      { item: 'Backend Development',        amount: 120000 },
      { item: 'Database + Cloud Setup',     amount: 35000  },
      { item: 'Integrations',               amount: 25000  },
      { item: 'Testing & QA',               amount: 30000  },
      { item: 'Deployment + CI/CD',         amount: 20000  },
    ],
    stack: {
      frontend: 'Next.js 14',
      backend:  'Node.js + Express',
      database: 'PostgreSQL + Redis',
      cloud:    'Vercel + Railway',
    },
    total: 385000,
  }
}

// POST /api/proposals/generate
router.post('/generate', authMiddleware, async (req, res) => {
  const { project_id } = req.body

  try {
    // Get project from DB
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND client_id = $2',
      [project_id, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const project = result.rows[0]
    let proposalData = null

    // Try to get AI-generated proposal
    try {
      const prompt = `Return ONLY a JSON object. No explanation. No markdown. No extra text. Just the raw JSON.

{
  "scope": [
    "UI/UX design with Figma prototypes",
    "Frontend development with Next.js",
    "Backend REST APIs with Node.js",
    "PostgreSQL database setup",
    "Payment gateway integration",
    "Cloud deployment on Vercel"
  ],
  "timeline": [
    {"week": "Weeks 1-2", "task": "Discovery and Design"},
    {"week": "Weeks 3-5", "task": "Frontend Development"},
    {"week": "Weeks 5-8", "task": "Backend Development"},
    {"week": "Weeks 9-10", "task": "Testing and Deployment"}
  ],
  "cost": [
    {"item": "UI/UX Design", "amount": 45000},
    {"item": "Frontend", "amount": 110000},
    {"item": "Backend", "amount": 120000},
    {"item": "Database and Cloud", "amount": 35000},
    {"item": "Testing", "amount": 30000},
    {"item": "Deployment", "amount": 20000}
  ],
  "stack": {
    "frontend": "Next.js 14",
    "backend": "Node.js + Express",
    "database": "PostgreSQL",
    "cloud": "Vercel + Railway"
  },
  "total": 360000
}

Now generate similar JSON for this project:
Title: ${project.title}
Description: ${project.description || 'Web application'}
Budget: ${project.budget_min || 300000}

Return ONLY the JSON object:`

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt,
          stream: false,
          options: {
            temperature: 0.1,
            top_p: 0.9,
          },
        }),
      })

      const aiData = await response.json()
      console.log('AI raw response:', aiData.response?.substring(0, 200))

      proposalData = extractJSON(aiData.response)

      if (!proposalData) {
        console.log('JSON extraction failed, using default template')
        proposalData = getDefaultProposal(project)
      }

    } catch (aiErr) {
      console.log('AI failed, using default template:', aiErr.message)
      proposalData = getDefaultProposal(project)
    }

    // Make sure total is calculated
    if (!proposalData.total) {
      proposalData.total = proposalData.cost.reduce(
        (sum, item) => sum + (item.amount || 0), 0
      )
    }

    // Save to DB
    const saved = await pool.query(
      `INSERT INTO proposals (project_id, scope, timeline, cost, stack, total)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        project_id,
        JSON.stringify(proposalData.scope),
        JSON.stringify(proposalData.timeline),
        JSON.stringify(proposalData.cost),
        JSON.stringify(proposalData.stack),
        proposalData.total,
      ]
    )

    res.json({ proposal: proposalData, id: saved.rows[0].id })

  } catch (err) {
    console.error('Proposal generation error:', err.message)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// GET /api/proposals/:project_id
router.get('/:project_id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM proposals WHERE project_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.params.project_id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No proposal found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router