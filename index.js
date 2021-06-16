// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
  allowEIO3: true // false by default
});

app.set('port', (process.env.PORT || 5000));

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom
io.on('connection', function(socket){
  console.log('User Conncetion');

  socket.on('typing', function(typing){
    console.log("Typing.... ");
    io.emit('typing', typing);
  });

  socket.on('new message', function(msg){
    io.emit('new message', msg);
  });
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});