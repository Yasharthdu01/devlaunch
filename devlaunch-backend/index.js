require('dotenv').config()
const pool = require('./db')
const { createApp } = require('./app')
const { pendingMigrations } = require('./lib/migrate')

const app = createApp()
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  require('./lib/llm').checkConfiguredModel()

  // Migrations run before deploy (npm run migrate). If any are pending, the
  // code and schema are out of sync: say so loudly instead of failing later.
  pendingMigrations(pool)
    .then(pending => {
      if (pending.length) console.error(`[migrate] PENDING MIGRATIONS, run "npm run migrate": ${pending.join(', ')}`)
    })
    .catch(err => console.error(`[migrate] could not check migrations: ${err.message}`))
})
