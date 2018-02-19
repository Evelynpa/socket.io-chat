var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

users = [];
connections = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function () {
  console.log('listening on *:3000');
});


io.on('connection', function (socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);
  socket.broadcast.emit('hi');

  // disconnected
  socket.on('disconnect', function (data) {
    updateUsernames();
    users.splice(users.indexOf(socket.username), 1);
    console.log('user disconnected');
  });
  // send message
  socket.on('chat message', function (data) {
    console.log('message: ' + data);
    io.emit('chat message', { msg: data, user: socket.username });
  });


  // new users
  socket.on('new user', function (nickname, callback) {
    console.log('user' + nickname);
    callback(true);
    socket.username = nickname;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit('get users', users);
  }
});


