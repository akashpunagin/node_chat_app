const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();

// Create and configure server
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

io.on('connection', (socket) => {
  console.log("New user connected");

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      callback("Name and Room are required");
    } else {
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);

      io.to(params.room).emit("updateUserList", users.getUserList(params.room));

      socket.emit('newMessage', generateMessage('admin', 'Welcome to this Chat App'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} joined this room`));
      callback();
    }
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      callback();
    }

  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));      
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit("newMessage", generateMessage('admin', `${user.name} left the room`));
    }
  });
});

// Middleware
app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
