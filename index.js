var app = require('express')();
var http = require('http');
var path = require('path');
var express = require('express');

app.get('/', function(req, res){
	res.sendfile('index.html');
});

app.use(express.static('public'));

var sockets = {};

var game = {
	players: {
		'Harry': {
			connected: false,
			team: 0
		},
		'Laurie': {
			connected: false,
			team: 1
		}
	},
	units: [
		{
			id: 'Holmes',
			pos: {x: 3, y: 6},
			type: 1,
			team: 0
		},
		{
			id: 'Ace',
			pos: {x: 13, y: 10},
			type: 0, // Make soldier types enum available here
			team: 1
		}
	]
};

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

var server = http.Server(app);

server.listen(app.get('port') ,app.get('ip'), function () {
	console.log('listening on *:' + app.get('port'));
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
	var userId;
	
	socket.on('disconnect', function(){
		if(!userId)
			return;
	
		console.log("disconnected", userId);
		
		game.players[userId].connected = false;
		delete sockets[userId];
	});
	
	socket.on('init', function(msg){
		userId = msg.id;
		
		console.log("connected", msg.id);
		
		game.players[userId].connected = true;
		sockets[userId] = this;
		
		socket.emit('init', game);
	});
	
	socket.on('update', function(message){
		message.event = 'socket ' + message.event;
		
		for(var player in game.players)
			if(player !== userId)
			{
				console.log("Send to", player, message);
				sockets[player].emit('update', message);
			}
	});
});