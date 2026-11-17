// Minimal versioned migration runner.
//
// - Migrations are plain SQL files in /migrations named NNN_description.sql and
//   run in filename order, each inside its own transaction.
// - Applied versions are recorded in schema_migrations with a checksum, so an
//   edited migration is detected instead of silently skipped.
// - A Postgres advisory lock makes concurrent runs (two deploys, two replicas)
//   wait for each other instead of applying the same migration twice.

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations')
const LOCK_KEY = 728_394_001 // arbitrary app-specific constant

function listMigrations(dir = MIGRATIONS_DIR) {
  return fs
    .readdirSync(dir)
    .filter(f => /^\d{3,}_[\w-]+\.sql$/.test(f))
    .sort()
    .map(file => {
      const sql = fs.readFileSync(path.join(dir, file), 'utf8')
      return {
        version: file.split('_')[0],
        name: file,
        sql,
        checksum: crypto.createHash('sha256').update(sql).digest('hex'),
      }
    })
}

async function ensureTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(20) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      checksum CHAR(64) NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

async function appliedMigrations(client) {
  const { rows } = await client.query('SELECT version, name, checksum FROM schema_migrations')
  return new Map(rows.map(r => [r.version, r]))
}

// Apply all pending migrations. Returns the names of the ones applied.
async function migrate(pool, { log = console, dir } = {}) {
  const client = await pool.connect()
  const applied = []
  try {
    await client.query('SELECT pg_advisory_lock($1)', [LOCK_KEY])
    await ensureTable(client)
    const done = await appliedMigrations(client)

    for (const m of listMigrations(dir)) {
      const prev = done.get(m.version)
      if (prev) {
        if (prev.checksum !== m.checksum) {
          log.warn(`[migrate] ${m.name} was edited after being applied (checksum mismatch). Add a new migration instead.`)
        }
        continue
      }
      log.log(`[migrate] applying ${m.name}`)
      try {
        await client.query('BEGIN')
        await client.query(m.sql)
        await client.query('INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)', [
          m.version,
          m.name,
          m.checksum,
        ])
        await client.query('COMMIT')
        applied.push(m.name)
      } catch (err) {
        await client.query('ROLLBACK')
        throw new Error(`Migration ${m.name} failed and was rolled back: ${err.message}`)
      }
    }
    log.log(applied.length ? `[migrate] applied ${applied.length} migration(s)` : '[migrate] database is up to date')
    return applied
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [LOCK_KEY]).catch(() => {})
    client.release()
  }
}

// Names of migrations present on disk but not yet applied.
async function pendingMigrations(pool, { dir } = {}) {
  const client = await pool.connect()
  try {
    const exists = await client.query("SELECT to_regclass('public.schema_migrations') AS t")
    const done = exists.rows[0].t ? await appliedMigrations(client) : new Map()
    return listMigrations(dir)
      .filter(m => !done.has(m.version))
      .map(m => m.name)
  } finally {
    client.release()
  }
}

module.exports = { migrate, pendingMigrations, listMigrations }
