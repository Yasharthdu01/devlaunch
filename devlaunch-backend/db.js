const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Neon closes idle connections; recycle ours first and fail fast on connect.
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Without this listener, an idle client being dropped by the database server
// (e.g. Neon scaling to zero) emits an unhandled 'error' and crashes the process.
pool.on('error', (err) => {
  console.error('[db] idle client error (pool will reconnect):', err.message)
})

// Startup check: borrow a client, verify the connection, and give it back.
pool
  .query('SELECT 1')
  .then(() => console.log('PostgreSQL connected ✅'))
  .catch((err) => console.error('DB connection error ❌', err.message))

module.exports = pool
