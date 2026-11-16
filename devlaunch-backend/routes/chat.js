const express = require('express')
const router = express.Router()
const llm = require('../lib/llm')
const { requests } = require('../lib/schemas')
const { validateBody, aiLimiter, sendAIError } = require('../lib/http')

const SYSTEM = `You are the DevLaunch AI assistant, an expert software delivery consultant.
You help clients with tech stacks, timelines, costs, and best practices for building web and mobile apps.
Be friendly, practical, and specific. Keep responses to 3-5 sentences unless asked for more detail.
Stay on the topic of software projects; politely decline unrelated requests.`

const HISTORY_LIMIT = 10 // last N turns sent to the model, to bound tokens and cost

// POST /api/chat
router.post('/', aiLimiter, validateBody(requests.chat), async (req, res) => {
  const { message, history } = req.body
  try {
    const reply = await llm.chat({
      system: SYSTEM,
      messages: [...history.slice(-HISTORY_LIMIT), { role: 'user', content: message }],
      temperature: 0.5,
      maxTokens: 400,
    })
    res.json({ reply })
  } catch (err) {
    sendAIError(res, err, { reply: 'Sorry, I am having trouble connecting right now. Please try again in a moment.' })
  }
})

module.exports = router
