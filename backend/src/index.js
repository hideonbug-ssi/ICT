// src/index.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// When a client connects
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Receive messages from the client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // Echo the message back to the client
    ws.send(`Server received: ${message}`);
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
