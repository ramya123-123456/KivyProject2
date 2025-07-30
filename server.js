// server.js

// Import required modules
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

// Setup the Express app and create an HTTP server
const app = express();
const server = http.createServer(app);

// Initialize a new Socket.IO instance by passing it the HTTP server
const io = new Server(server);

// Define the port to run the server on
const PORT = 3000;

// Use Express to serve the 'index.html' file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// This is the core of our real-time functionality
// Listen for new connections from clients
io.on('connection', (socket) => {
  console.log('A user connected');

  // Broadcast a 'system' message to all clients except the one that just connected
  socket.broadcast.emit('system message', { text: 'A new user has joined the chat.' });

  // Listen for a 'chat message' event from a client
  socket.on('chat message', (data) => {
    // When a message is received, broadcast it to ALL connected clients
    // We forward the data object which includes the username and message
    io.emit('chat message', data);
  });

  // Listen for when a client disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Broadcast a system message to all remaining clients
    io.emit('system message', { text: 'A user has left the chat.' });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});