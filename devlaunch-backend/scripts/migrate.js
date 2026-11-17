// Usage: npm run migrate
// Runs as Railway's pre-deploy command: if it fails, the new release is not
// deployed and the previous one keeps serving traffic.
require('dotenv').config()
const pool = require('../db')
const { migrate } = require('../lib/migrate')

migrate(pool)
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch(err => {
    console.error(`[migrate] ${err.message}`)
    pool.end().finally(() => process.exit(1))
  })
