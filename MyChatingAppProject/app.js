
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
 res.sendfile(__dirname + '/public/index.html');
});


var usernames = {};

io.sockets.on('connect', function (socket) {

 socket.on('sendchat', function (data) {
 io.sockets.emit('updatechat', socket.username, data);
 });


socket.on('base64 file', function (msg) {
    console.log('A Photo send  ' + msg.username);
    socket.username = msg.username;
    // socket.broadcast.emit('base64 image', //exclude sender
    io.sockets.emit('base64 file',  //include sender

        {
          username: socket.username,
          file: msg.file,
          fileName: msg.fileName
        }

    );
});



 socket.on('conectUser', function(username){
 socket.username = username;
 usernames[username] = username;
 socket.emit('updatechat', 'SERVER', 'you have connected ('+ username+')' );
 socket.broadcast.emit('updatechat', 'SERVER'
 , username + ' has connected this conversation');
 io.sockets.emit('updateusers', usernames);
 });


 socket.on('disconnect', function(){
 delete usernames[socket.username];
 io.sockets.emit('updateusers', usernames);
 socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has Out form this Convercation');
 });



});
var port = 8080;
server.listen(port);
console.log('SERVER Runing on port-8080');


