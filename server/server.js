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

  socket.on('getActiveRooms', () => {
    var activeRooms = [];
    Object.keys(io.sockets.adapter.rooms).forEach((room) => {
      var isRoom = true;
      Object.keys(io.sockets.adapter.sids).forEach((id) => {
        isRoom = (id === room)? false: isRoom;
      });
      if (isRoom) activeRooms.push(room);
    });
    socket.emit('updateActiveRoomsDropDown', activeRooms);
  });

  socket.on('join', (params, callback) => {
    if (params.rooms !== "custom") params.room = params.rooms;
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("Name and Room are required");
    } else if (!users.isUserNameAvailable(params.name)) {
      callback(`Username - ${params.name} is not available, please try with different username`);
    } else {
      params.room = params.room.toLowerCase();
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);

      io.to(params.room).emit("updateUserList", users.getUserList(params.room));

      socket.emit('newMessage', generateMessage('admin', 'Welcome to Chat App'));
      if (users.getUserList(params.room).length > 1) {
        socket.emit('newMessage', generateMessage('admin', `Members of ${params.room} welcomes you`));
      }
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
