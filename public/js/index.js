var socket = io();

socket.on('connect', function () {
  console.log("Connected to server");
  socket.emit('createMessage', {
    from: "mike@gmail.com",
    text: "Hello this is new message form mike"
  })
});

socket.on('disconnect', function () {
  console.log("Disconnected form server");
});

socket.on('newMessage', function (message) {
  console.log("New message:", message);
});
