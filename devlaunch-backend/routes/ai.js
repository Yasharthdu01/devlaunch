const express = require('express')
const router = express.Router()
const axios = require('axios')

// POST /api/ai/suggest
router.post('/suggest', async (req, res) => {
  const { step, data } = req.body

  const prompts = {
    1: `A client wants to build: "${data}". In 3 short bullet points, suggest the best approach for their project type and industry. Be specific and practical. Keep it under 80 words.`,
    2: `For a ${data} application, in 3 bullet points suggest: which platform to prioritize (web/mobile/both), why, and what to skip in Phase 1. Keep it under 80 words.`,
    3: `For a ${data} app frontend, suggest in 3 bullet points: best framework, design approach, and number of screens needed. Keep it under 80 words.`,
    4: `For a ${data} app backend, suggest in 3 bullet points: best backend framework, database choice with reason, and top 3 integrations needed. Keep it under 80 words.`,
    5: `For a ${data} business, suggest in 3 bullet points: top SEO keywords to target, best marketing channel, and one quick win for getting first customers. Keep it under 80 words.`,
    6: `For a ${data} app, suggest in 3 bullet points: best cloud hosting choice, estimated monthly infra cost, and CI/CD approach. Keep it under 80 words.`,
  }
  console.log('Received AI suggestion request for step', step, 'with data:', data)
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3',
      prompt: prompts[step] || prompts[1],
      stream: false
    })
    console.log('AI response:', response.data)
    res.json({ suggestion: response.data.response })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ suggestion: 'AI suggestion unavailable right now.' })
  }
})

module.exports = router