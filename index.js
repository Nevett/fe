var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');

app.get('/', function(req, res){
	res.sendfile('index.html');
});

app.get('/spritesheet.png', function (req, res) {
    res.sendfile(__dirname + '\\spritesheet.png');
});

app.get('/gameClass.js', function (req, res) {
    res.sendfile(__dirname + '\\gameClass.js');
});

app.use(express.static('public'));

var sockets = {};

io.on('connection', function(socket){
	var socketId;
	
	socket.on('disconnect', function(){
		delete sockets[socketId];
	});
	
	socket.on('init', function(msg){
		socketId = msg.id;
		
		console.log("connected", msg.id);
		
		sockets[socketId] = socket;
	});
	
	socket.on('update', function(message){
		message.event = 'socket ' + message.event;
		
		for(var s in sockets)
			if(sockets[s] !== socket)
			{
				console.log("Emit", s, message);
				sockets[s].emit('update', message);
			}
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});