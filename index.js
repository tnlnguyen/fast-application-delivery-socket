// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('port', (process.env.PORT || 5000));

// Routing
app.use(express.static(path.join(__dirname, 'public')));

io = socketIO(server, {transports: ['websocket']});

// Chatroom
io.on('connection', (socket) => {
  console.log('new connection')
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    console.log('new message received')
    // we tell the client to execute 'new message'
    io.emit('new message', {
      username: data['username'],
      message: data['message']
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', (data) => {
    io.emit('typing', {
      username: data['username']
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', (data) => {
    io.emit('stop typing', {
      username: data['username']
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', (data) => {
    io.emit('user left', {
      username: data['username'],
    });
  });
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});