import pg from "pg";
import dotenv from "dotenv";
import logger from "../logger.js";

dotenv.config();

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_TEST ||
  process.env.MONGO_URI;

const isLocalhost =
  connectionString?.includes("localhost") ||
  connectionString?.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  ...(isLocalhost
    ? {}
    : {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
});

export const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === "development") {
    logger.info("Executed DB query", { text, duration, rows: res.rowCount });
  }
  return res;
};

export const initDb = async () => {
  try {
    // Enable uuid-ossp or pgcrypto extension if available
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        reset_password_token VARCHAR(255) DEFAULT NULL,
        reset_password_expires TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(500) DEFAULT 'default-post-image.jpg',
        category VARCHAR(100) DEFAULT 'Other',
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info("Connected to PostgreSQL and initialized database tables.");
  } catch (error) {
    logger.error("Failed to initialize PostgreSQL database:", {
      message: error.message,
    });
    throw error;
  }
};

export default {
  pool,
  query,
  initDb,
};
