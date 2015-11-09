var socket = io();

socket.emit('message', {id: Global.NewId()});

socket.on('message', function(e){
console.log(e);
});