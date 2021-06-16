// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom
io.on('connection', (socket) => {
  console.log('new connection')
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    console.log('new message received')
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: data['username'],
      message: data['message']
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', {
      username: data['username']
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', (data) => {
    socket.broadcast.emit('stop typing', {
      username: data['username']
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', (data) => {
    socket.broadcast.emit('user left', {
      username: data['username'],
    });
  });
});
