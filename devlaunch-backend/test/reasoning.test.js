const { test, beforeEach, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const llm = require('../lib/llm')

let requests
function fakeReply(content, finish_reason = 'stop') {
  llm.setClient({
    chat: {
      completions: {
        create: async (req) => {
          requests.push(req)
          return { choices: [{ message: { content }, finish_reason }] }
        },
      },
    },
  })
}

beforeEach(() => {
  requests = []
})
afterEach(() => {
  delete process.env.LLM_REASONING_EFFORT
  delete process.env.LLM_REASONING_TOKENS
})

test('without LLM_REASONING_EFFORT the request is unchanged', async () => {
  fakeReply('hello')
  await llm.chat({ messages: [{ role: 'user', content: 'hi' }], maxTokens: 200 })
  assert.equal(requests[0].max_tokens, 200)
  assert.equal(requests[0].reasoning_effort, undefined)
})

test('LLM_REASONING_EFFORT adds reasoning_effort and token headroom', async () => {
  process.env.LLM_REASONING_EFFORT = 'low'
  fakeReply('hello')
  await llm.chat({ messages: [{ role: 'user', content: 'hi' }], maxTokens: 200 })
  assert.equal(requests[0].reasoning_effort, 'low')
  assert.equal(requests[0].max_tokens, 1700)
})

test('inline <think> blocks are stripped from answers', async () => {
  fakeReply('<think>the user wants a stack {maybe}</think>\nUse Next.js and Postgres.')
  const text = await llm.chat({ messages: [{ role: 'user', content: 'hi' }] })
  assert.equal(text, 'Use Next.js and Postgres.')
  assert.equal(llm.stripReasoning('partial reasoning...</think>Answer'), 'Answer')
})

test('empty answer after reasoning reports the token limit', async () => {
  fakeReply('', 'length')
  await assert.rejects(llm.chat({ messages: [{ role: 'user', content: 'hi' }] }), /token limit/)
})
