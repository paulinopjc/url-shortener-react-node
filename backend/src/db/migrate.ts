import 'dotenv/config'
import pool from './connection'

const migrate = async () => {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        title VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS clicks (
        id SERIAL PRIMARY KEY,
        url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
        referrer TEXT,
        user_agent TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_urls_code ON urls(code);
      CREATE INDEX IF NOT EXISTS idx_clicks_url_id ON clicks(url_id);
      CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at);
    `)
    console.log('Migration completed successfully')
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
