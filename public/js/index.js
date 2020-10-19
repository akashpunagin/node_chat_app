var socket = io();

function onRoomDropDownChange() {
  console.log("room");
}

socket.on('connect', function () {
  socket.emit('getActiveRooms');
});

var roomsDropDown = $("#roomsDropDown");
var roomNameForm = $("#room-name");

socket.on('updateActiveRoomsDropDown', function (activeRooms) {
  var select = roomsDropDown
  activeRooms.forEach(function (room) {
    var option = $("<option></option>");
    option.attr("value", room);
    select.append(option.text(room));
  });
});

roomsDropDown.on('change', function() {
  var select = $("#roomsDropDown");
  if (select.val() !== "custom") {
    roomNameForm.hide();
  } else {
    roomNameForm.show();
  }
});
