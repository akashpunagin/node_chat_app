const path = require('path');
const http = require('http');
const express = require('express');
// const hbs = require('hbs');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message.js');

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

  socket.emit('newMessage', generateMessage('admin', 'Welcome to this chat'));

  socket.broadcast.emit('newMessage', generateMessage('admin', 'New User joined'));

  socket.on('createMessage', (message) => {
    console.log("create message:", message);
    io.emit('newMessage', generateMessage(message.from, message.text));
  });
});

// Middleware
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
