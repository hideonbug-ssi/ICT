// config/postgres.js
const { Pool } = require('pg'); // Import PostgreSQL client
require('dotenv').config(); // Load environment variables

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT || 5432; // Default PostgreSQL port
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

// Create a PostgreSQL connection pool
const dbPool = new Pool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

// Connect to PostgreSQL
async function connectDB() {
  try {
    await dbPool.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Connection to PostgreSQL failed:', err.stack);
    process.exit(1); // Exit the application if the connection fails
  }
}

// Export the pool and connect function
module.exports = {
  dbPool,
  connectDB,
};