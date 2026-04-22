const pool = require('./db')

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS proposals (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id),
      scope JSONB,
      timeline JSONB,
      cost JSONB,
      stack JSONB,
      total INTEGER,
      status VARCHAR(20) DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
  console.log('✅ proposals table created')
  process.exit(0)
}
run()