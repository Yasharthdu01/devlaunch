// Test harness: swaps the real Postgres pool and LLM client for in-memory fakes
// so the whole Express app can be exercised without a database or API key.

const path = require('path')
const jwt = require('jsonwebtoken')

process.env.JWT_SECRET = 'test-secret'
process.env.NODE_ENV = 'test'
process.env.AI_RATE_LIMIT_PER_MIN = '1000'

// ---- Fake database --------------------------------------------------------
// Queries are answered by handlers registered per test: [regex, rows | fn(params)].
// Fake accounts for the auth middleware's context query (users ⨝ memberships).
const users = {
  1: { id: 1, name: 'Alice', email: 'alice@example.com', is_super_admin: false, memberships: [{ org_id: 1, org_role: 'client' }] },
  2: { id: 2, name: 'Bob', email: 'bob@example.com', is_super_admin: false, memberships: [{ org_id: 1, org_role: 'client' }] },
  99: { id: 99, name: 'Admin', email: 'admin@example.com', is_super_admin: false, memberships: [{ org_id: 1, org_role: 'org_admin' }] },
}
function contextRows([userId]) {
  const u = users[userId]
  if (!u) return []
  return u.memberships.map(m => ({
    id: u.id, name: u.name, email: u.email, is_super_admin: u.is_super_admin, company_name: null, industry: null,
    org_id: m.org_id, org_role: m.org_role, org_name: 'DevLaunch', org_slug: 'devlaunch', org_status: 'active',
  }))
}

const db = {
  baseHandlers: [[/FROM users u\s+LEFT JOIN memberships m/, contextRows]],
  handlers: [],
  calls: [],
  on(pattern, result) {
    this.handlers.unshift([pattern, result])
  },
  reset() {
    this.handlers = []
    this.calls = []
  },
  async query(sql, params = []) {
    this.calls.push({ sql, params })
    for (const [pattern, result] of [...this.handlers, ...this.baseHandlers]) {
      if (pattern.test(sql)) {
        const rows = typeof result === 'function' ? result(params) : result
        return { rows, rowCount: rows.length }
      }
    }
    return { rows: [], rowCount: 0 } // CREATE TABLE etc.
  },
  connect: async () => ({ release() {} }),
}

const dbPath = path.resolve(__dirname, '../db.js')
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: db }

// ---- Fake LLM client ------------------------------------------------------
const llm = require('../lib/llm')

// queue of responses: string (model text) or Error (thrown)
const fakeLLM = {
  queue: [],
  requests: [],
  reply(...items) {
    this.queue.push(...items)
  },
  reset() {
    this.queue = []
    this.requests = []
  },
  client: {
    chat: {
      completions: {
        create: async (req) => {
          fakeLLM.requests.push(req)
          if (fakeLLM.queue.length === 0) throw new Error('fakeLLM: no response queued')
          const next = fakeLLM.queue.shift()
          if (next instanceof Error) throw next
          return { choices: [{ message: { content: next } }] }
        },
      },
    },
  },
}
llm.setClient(fakeLLM.client)

const { createApp } = require('../app')

function tokenFor(user) {
  return jwt.sign(user, process.env.JWT_SECRET)
}

module.exports = { db, fakeLLM, createApp, tokenFor, users }
