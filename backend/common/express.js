const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/leaderboard' })

wss.on('connection', ws => {
    console.log('New client connected to /leaderboard');
    ws.on('close', () => console.log('Client disconnected from /leaderboard'));
});

function emit (message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    })
}

module.exports = { wss, app, emit, server}