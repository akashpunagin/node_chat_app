var socket = io();

socket.on('connect', function () {
  socket.emit('getActiveRooms');
});

socket.on('updateActiveRoomsDropDown', function (activeRooms) {
  var select = $("<select></select>");
  select.attr("id", "rooms").attr("name", "rooms");
  activeRooms.forEach(function (room) {
    var option = $("<option></option>");
    option.attr("value", room);
    select.append(option.text(room));
  });
  $("#activeRooms").html(select);
});
