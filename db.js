import pkg from "pg";

const { Client } = pkg;

import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Create a new client instance
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // For Railway to work
  },
});

// Connect to the database
db.connect()
  .then(() => console.log("Connected to the PostgreSQL database!"))
  .catch((err) => console.error("Error connecting to the database:", err));

export default db;
