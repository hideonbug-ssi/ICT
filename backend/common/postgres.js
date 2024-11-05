const { Pool } = require('pg'); // Import PostgreSQL client
require('dotenv').config(); // Load environment variables

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT || 5432; // Default PostgreSQL port
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const serverPort = process.env.PORT || 3000;

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

// Start the server and database connection
async function startServer() {
  await connectDB();
  server.listen(serverPort, () => {
    console.log(`Server is running on http://localhost:${serverPort}`);
  });
}

// Gracefully shut down the server
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await dbPool.end(); // Close the database connection pool
  process.exit(0); // Exit the application
});

// Start the application
startServer();