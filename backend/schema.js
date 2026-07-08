import pool from "./db.js";

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      google_id VARCHAR(255) UNIQUE NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      status VARCHAR(20) DEFAULT 'todo',
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS time_logs (
      id SERIAL PRIMARY KEY,
      task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      duration INTEGER
    )
  `);

  await pool.query(`
    ALTER TABLE tasks 
    ADD COLUMN IF NOT EXISTS timer_started_at TIMESTAMP
  `);

  console.log("All tables created successfully");
  pool.end();
};

createTables();