const pool = require('./db')

async function createTables() {
  try {

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'client',
        company_name VARCHAR(100),
        industry VARCHAR(100),
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ users table ready')

    // Projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES users(id),
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'discovery',
        budget_min INTEGER,
        budget_max INTEGER,
        timeline_weeks INTEGER,
        platform VARCHAR(100),
        requirements JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ projects table ready')

    // Reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES users(id),
        project_id INTEGER REFERENCES projects(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        company VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ reviews table ready')

    // Chat messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        project_id INTEGER,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ chat_messages table ready')

    console.log('🎉 All tables created successfully!')
    process.exit(0)

  } catch (err) {
    console.error('Error creating tables:', err.message)
    process.exit(1)
  }
}

createTables()