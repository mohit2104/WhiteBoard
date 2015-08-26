var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/draw.html');
});

app.use("/static", express.static(__dirname + '/public'));

io.on('connection', function(socket){
  socket.on('draw message', function(msg){
    socket.broadcast.emit('draw message', msg);
  });
});

http.listen(3002, function(){
  console.log('listening on *:3000');
});
