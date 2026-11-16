// Regression tests for two production incidents:
//  1. The API crashed when the database dropped an idle connection.
//  2. AI calls failed with 404 because LLM_MODEL wasn't available to the key.

const { test } = require('node:test')
const assert = require('node:assert/strict')

process.env.DATABASE_URL = 'postgres://u:p@127.0.0.1:1/db'

test('a dropped database connection is logged, not fatal', () => {
  const pool = require('../db')
  assert.ok(pool.listenerCount('error') > 0, 'pool must have an error listener')
  const original = console.error
  console.error = () => {}
  try {
    // An 'error' with no listener would throw here and crash the process.
    assert.doesNotThrow(() => pool.emit('error', new Error('Connection terminated unexpectedly')))
  } finally {
    console.error = original
  }
})

test('checkConfiguredModel warns when the model is not available to the key', async () => {
  const llm = require('../lib/llm')
  process.env.LLM_MODEL = 'llama-3.1-8b-instant'
  llm.setClient({ models: { list: async () => ({ data: [{ id: 'openai/gpt-oss-20b' }, { id: 'qwen/qwen3-32b' }] }) } })

  const logs = { log: [], error: [] }
  const log = { log: m => logs.log.push(m), error: m => logs.error.push(m) }

  const ids = await llm.checkConfiguredModel(log)
  assert.deepEqual(ids, ['openai/gpt-oss-20b', 'qwen/qwen3-32b'])
  assert.match(logs.error[0], /NOT available/)
  assert.match(logs.error[0], /openai\/gpt-oss-20b/)

  process.env.LLM_MODEL = 'qwen/qwen3-32b'
  logs.error = []
  await llm.checkConfiguredModel(log)
  assert.equal(logs.error.length, 0)
  assert.match(logs.log[0], /ready/)
})
