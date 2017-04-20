const io // require('socket.io')() - whole namespace ;
const client // or socket - one client connected to websocket;
// sending to sender-client only
client.emit('message', 'this is a test');

// sending to all clients, include sender
io.emit('message', 'this is a test');

// sending to all clients except sender
client.broadcast.emit('message', 'this is a test');

// sending to all clients in 'game' room(channel) except sender
client.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
client.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
client.broadcast.to(socketid).emit('message', 'for your eyes only');