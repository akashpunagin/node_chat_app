var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}


socket.on('connect', function () {
  var params = $.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
  });
});

socket.on('disconnect', function () {
  console.log("Disconnected form server");
});

socket.on('updateUserList', function (users) {
  var ol = $("<ol></ol>");
  users.forEach(function (user) {
    ol.append($("<li></li>").text(user));
  });

  $("#users").html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
});

var messageTextBox = $("[name=message]");
$('#message-form').on('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
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
