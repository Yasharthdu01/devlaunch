// Single entry point for every LLM call in DevLaunch.
//
// Uses the OpenAI-compatible Chat Completions API, so the same code talks to
// a hosted provider in production (OpenAI, Groq, OpenRouter, Together, ...)
// and to a local Ollama server in development (http://localhost:11434/v1).
//
// Env:
//   LLM_BASE_URL   provider base URL   (default: https://api.openai.com/v1)
//   LLM_API_KEY    provider API key    (Ollama ignores it; any value works)
//   LLM_MODEL      model name          (e.g. gpt-4o-mini, llama-3.1-8b-instant, llama3.2)
//   LLM_TIMEOUT_MS request timeout     (default: 30000)

const { OpenAI } = require('openai')

class LLMError extends Error {
  constructor(message, { code = 'AI_UNAVAILABLE', cause } = {}) {
    super(message)
    this.name = 'LLMError'
    this.code = code
    if (cause) this.cause = cause
  }
}

let client = null

function getClient() {
  if (client) return client
  const baseURL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1'
  const apiKey = process.env.LLM_API_KEY
  if (!apiKey && !/localhost|127\.0\.0\.1/.test(baseURL)) {
    throw new LLMError('LLM_API_KEY is not set', { code: 'AI_NOT_CONFIGURED' })
  }
  client = new OpenAI({
    baseURL,
    apiKey: apiKey || 'ollama',
    timeout: Number(process.env.LLM_TIMEOUT_MS) || 30000,
    maxRetries: 1, // network-level retry; output-level retries are handled below
  })
  return client
}

// Tests inject a fake client here.
function setClient(fake) {
  client = fake
}

function model() {
  return process.env.LLM_MODEL || 'gpt-4o-mini'
}

// Plain text completion. `messages` uses the standard {role, content} shape.
async function chat({ system, messages, temperature = 0.4, maxTokens = 500 }) {
  const all = system ? [{ role: 'system', content: system }, ...messages] : messages
  let res
  try {
    res = await getClient().chat.completions.create({
      model: model(),
      messages: all,
      temperature,
      max_tokens: maxTokens,
    })
  } catch (err) {
    if (err instanceof LLMError) throw err
    throw new LLMError(`LLM request failed: ${err.message}`, { cause: err })
  }
  const text = res?.choices?.[0]?.message?.content
  if (!text || !text.trim()) throw new LLMError('LLM returned an empty response')
  return text.trim()
}

// Pull the first {...} block out of model text (models often wrap JSON in prose
// or ```json fences).
function extractJSON(text) {
  if (!text) return null
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1] : text
  const start = body.indexOf('{')
  const end = body.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(body.slice(start, end + 1))
  } catch {
    return null
  }
}

// Ask for JSON, validate it against a zod schema, and retry with the
// validation errors fed back to the model. Throws LLMError(code
// 'AI_INVALID_OUTPUT') if no attempt produces valid data.
async function generateJSON({ system, prompt, schema, retries = 2, temperature = 0.2, maxTokens = 1200 }) {
  const messages = [{ role: 'user', content: prompt }]
  let lastProblem = ''

  for (let attempt = 0; attempt <= retries; attempt++) {
    const text = await chat({ system, messages, temperature, maxTokens })
    const raw = extractJSON(text)

    if (!raw) {
      lastProblem = 'Response did not contain a JSON object.'
    } else {
      const result = schema.safeParse(raw)
      if (result.success) return { data: result.data, attempts: attempt + 1 }
      lastProblem = result.error.issues
        .slice(0, 8)
        .map(i => `${i.path.join('.') || '(root)'}: ${i.message}`)
        .join('; ')
    }

    messages.push(
      { role: 'assistant', content: text },
      {
        role: 'user',
        content: `That output was invalid: ${lastProblem}\nReturn ONLY the corrected JSON object, nothing else.`,
      }
    )
  }

  throw new LLMError(`LLM output failed validation after ${retries + 1} attempts: ${lastProblem}`, {
    code: 'AI_INVALID_OUTPUT',
  })
}

// Wrap user-supplied text so the model treats it as data, not instructions.
function quoteUserInput(text) {
  return `<user_input>\n${String(text).replace(/<\/?user_input>/gi, '')}\n</user_input>`
}

module.exports = { chat, generateJSON, extractJSON, quoteUserInput, setClient, LLMError }
