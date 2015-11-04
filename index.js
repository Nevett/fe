var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendfile('index.html');
});

var mySocket;

io.on('connection', function(socket){
	console.log('a user has connected');
	socket.on('disconnect', function(){
		console.log('a user has disconnected');
	});
	socket.on('message', function(msg){
		console.log(msg);
	});
	
	mySocket = socket;
});

setTimeout(function(){
	mySocket.emit('message', 'Yo');
}, 3000);

http.listen(3000, function(){
	console.log('listening on *:3000');
});