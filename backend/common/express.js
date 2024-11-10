const express = require('express')
const http = require('http')
const WebSocket = require('ws')
// const {switchLeaderboardHandler} = require("../endpoint/switch_leaderboard");

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/leaderboard' })

wss.on('connection', (ws) => {
    console.log('New client connected')

    // Receive messages from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`)

        // Echo the message back to the client
        ws.send(`Server received: ${message}`)
    })

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected')
    })
})

function emit (message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    })
}

module.exports = { wss, app, emit, server}