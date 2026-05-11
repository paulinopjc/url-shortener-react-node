import pool from '../src/db/connection'

beforeAll(async () => {
  await pool.query(`
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
  `)
})

beforeEach(async () => {
  await pool.query('DELETE FROM clicks')
  await pool.query('DELETE FROM urls')
})

afterAll(async () => {
  await pool.end()
})
