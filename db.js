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

export default db;
