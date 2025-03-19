import pkg from "pg";

const { Client } = pkg;

import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Create a new client instance
const db = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ Database connection error:", err));

async function initializeDatabase() {
  try {
    // Create the chocolate_count table if it doesn't exist
    await db.query(`
        CREATE TABLE IF NOT EXISTS chocolate_count (
          id SERIAL PRIMARY KEY,
          count INT DEFAULT 0
        );
      `);

    // Insert a row with id=1 if it doesn't already exist
    await db.query(`
        INSERT INTO chocolate_count (id, count) 
        VALUES (1, 0)
        ON CONFLICT (id) DO NOTHING;
      `);

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}

// Initialize the database on start
initializeDatabase();

export default db;
