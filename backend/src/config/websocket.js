// config//websocket.js
const WebSocket = require('ws');

// Function to setup WebSocket
function setupWebSocket(server) {
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
}

module.exports = setupWebSocket;
