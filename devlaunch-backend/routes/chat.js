// const express = require('express')
// const router = express.Router()
// const pool = require('../db')
// const Anthropic = require('@anthropic-ai/sdk')
// require('dotenv').config()

// const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

// // POST /api/chat
// router.post('/', async (req, res) => {
//   const { message, history, project_context } = req.body

//   try {
//     // Build conversation history for Claude
//     const messages = [
//       ...(history || []).map(m => ({
//         role: m.role,
//         content: m.content,
//       })),
//       { role: 'user', content: message },
//     ]

//     const systemPrompt = `You are the DevLaunch AI assistant — an expert software delivery consultant. 
// You help clients understand tech stacks, timelines, costs, and best practices for building web and mobile applications.
// You are friendly, practical, and give specific actionable advice.
// ${project_context ? `Current project context: ${project_context}` : ''}
// Keep responses concise — 3-5 sentences max unless the user asks for more detail.`

//     const response = await client.messages.create({
//       model: 'claude-sonnet-4-6',
//       max_tokens: 500,
//       system: systemPrompt,
//       messages,
//     })

//     const reply = response.content[0].text
//     res.json({ reply })

//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ reply: 'Sorry, I am having trouble connecting right now. Please try again.' })
//   }
// })

// module.exports = router

const express = require('express')
const router = express.Router()
require('dotenv').config()

// POST /api/chat
router.post('/', async (req, res) => {
  const { message, history } = req.body

  // Build conversation as a single prompt string
  let conversationPrompt = `You are the DevLaunch AI assistant — an expert software delivery consultant. 
You help clients with tech stacks, timelines, costs, and best practices for building web and mobile apps.
Be friendly, practical, and give specific advice. Keep responses to 3-5 sentences max.

Conversation so far:
`
  if (history && history.length > 0) {
    history.slice(-6).forEach(m => {
      conversationPrompt += `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.content}\n`
    })
  }

  conversationPrompt += `Client: ${message}\nAssistant:`

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: conversationPrompt,
        stream: false,
      }),
    })

    const data = await response.json()
    res.json({ reply: data.response })

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ 
      reply: 'AI is offline. Make sure Ollama is running with: ollama serve' 
    })
  }
})

module.exports = router