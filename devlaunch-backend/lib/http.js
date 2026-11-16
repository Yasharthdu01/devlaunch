const rateLimit = require('express-rate-limit')
const { LLMError } = require('./llm')

// Validate req.body against a zod schema; replaces req.body with the parsed value.
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {})
    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid request',
        errors: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      })
    }
    req.body = result.data
    next()
  }
}

// LLM calls cost money per request, so they get a tighter limit than the rest of the API.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.AI_RATE_LIMIT_PER_MIN) || 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many AI requests. Please wait a minute and try again.', code: 'RATE_LIMITED' },
})

// Map an error from an AI route to an honest HTTP response (never fake data).
function sendAIError(res, err, extra = {}) {
  if (err instanceof LLMError) {
    console.error(`[ai] ${err.code}: ${err.message}`)
    const status = err.code === 'AI_INVALID_OUTPUT' ? 502 : 503
    return res.status(status).json({
      message: 'The AI service is unavailable right now. Please try again shortly.',
      code: err.code,
      ...extra,
    })
  }
  console.error('[ai] unexpected error:', err)
  return res.status(500).json({ message: 'Internal server error', ...extra })
}

module.exports = { validateBody, aiLimiter, sendAIError }
