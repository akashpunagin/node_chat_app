const path = require('path');
const http = require('http');
const express = require('express');
// const hbs = require('hbs');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

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

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      callback("Name and Room are required");
    } else {
      socket.join(params.room);
      socket.emit('newMessage', generateMessage('admin', 'Welcome to this Chat App'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} User joined`));
      callback();
    }
  });

  socket.on('createMessage', (message, callback) => {
    console.log("create message:", message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('user', coords.latitude, coords.longitude));
  });
});

// Middleware
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
