const path = require('path');
const http = require('http');
const express = require('express');
// const hbs = require('hbs');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();

// Create and configure server
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.on('disconnect', () => {
    console.log("Client disconnected");
  });

  socket.emit('newMessage', {
    from: "admin",
    text: "Welcome to the group chat!",
    createdAt: new Date(),
  });

  socket.broadcast.emit('newMessage', {
    from: "admin",
    text: "New user joined",
    createdAt: new Date(),
  });

  socket.on('createMessage', (message) => {
    console.log("create message:", message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date(),
    });
  });
});

// Middleware
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
