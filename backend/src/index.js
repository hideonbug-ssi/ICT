// index.js

const express = require('express'); // Import the Express module
const { app, wss, register, server } = require('../common/express.js'); // Assuming express.js exports your Express app and WebSocket server
const { connectDB } = require('../common/postgres.js'); // Import the connect function to connect to PostgreSQL
const test = require('../endpoint/test'); // Import your test routes
const { ShowScoreHandler } = require('../endpoint/show_score.js');

const { ShowTeamHandler } = require('../endpoint/show_team.js');
const { ShowPodiumHandler } = require('../endpoint/show_podium.js');

const { ShowLeaderboardHandler } = require('../endpoint/switch_leaderboard.js');
const { ShowPodiumHandler } = require('../endpoint/show_podium.js');
const { ShowRandomedTeamHandler} = require('../endpoint/show_randomed_team.js')
const {ShowCardHandler} = require('../endpoint/show_card.js');


const serverPort = process.env.PORT || 3000; // Define the server port

// Middleware for parsing JSON
app.use(express.json()); // This line parses JSON request bodies

// Register your routes
    // app.get('/', switchLeaderboardHandler)
// app.get('/showScore', ShowScoreHandler)

app.get('/showCard', ShowCardHandler)
app.post('/showScore', ShowScoreHandler)
app.get('/showLeaderboard', ShowLeaderboardHandler)
app.get('/showPodium', ShowPodiumHandler)
app.post('/randomTeam', ShowRandomedTeamHandler) 



// Start the server and database connection
async function startServer() { 
  await connectDB(); // Connect to PostgreSQL
  server.listen(serverPort, () => {
    console.log(`Server is running on http://localhost:${serverPort}`);
  });
}

// Gracefully shut down the server
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await wss.close(); // Close WebSocket server
  process.exit(0); // Exit the application
});

// Start the application
startServer();