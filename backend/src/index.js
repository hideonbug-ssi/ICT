// Import required modules
const express = require('express');
const http = require('http');
const dotenv = require('dotenv'); // To load environment variables
const { connectDB } = require('./config/postgres'); // PostgreSQL connection
const setupWebSocket = require('./config/websocket'); // WebSocket setup
const RandomBonusCardController = require('./controllers/RandomBonusCard'); // Controller for bonus card update

dotenv.config(); // Load environment variables from .env

const app = express(); // Create an Express app
const server = http.createServer(app); // Create an HTTP server

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to PostgreSQL database
connectDB(); 

// Define a route for updating bonus cards
app.post('/bonuscards', RandomBonusCardController.updateBonusCards);

// Setup WebSocket
setupWebSocket(server); 

// Define the port (default to 3000 if not in .env)
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

