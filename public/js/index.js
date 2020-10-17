var socket = io();

socket.on('connect', function () {
  console.log("Connected to server");
});

socket.on('disconnect', function () {
  console.log("Disconnected form server");
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var messageTemplate = $("#message-template").html();
  var html = Mustache.render(messageTemplate, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
  });

  $("#messages").append(html);
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var locationMessageTemplate = $('#location-message-template').html();
  var html = Mustache.render(locationMessageTemplate, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime,
  });

  $("#messages").append(html);
});

var messageTextBox = $("[name=message]");
$('#message-form').on('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: "user",
    text: messageTextBox.val(),
  }, function () {
    messageTextBox.val("");
  });
});

var locationButton = $('#send-location');
locationButton.on('click', function (e) {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
  } else {
    locationButton.attr('disabled', "disabled").text("Sending Location...");
    navigator.geolocation.getCurrentPosition(function (position) {
      locationButton.removeAttr('disabled').text("Send Location");
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }, function () {
      locationButton.removeAttr('disabled').text("Send Location");
      alert("Unable to fetch your location");
    });
  }
});
