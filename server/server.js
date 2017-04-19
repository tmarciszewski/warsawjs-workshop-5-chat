'use strict';

const io = require('socket.io')();
const auth = require('./auth.js');
const eventHandlers = require('./socketEventHandlers');

// function broadcastMessage(client, data) {
//  client.broadcast.emit('msg', color(`${data.nick}: `, 'green') + data.message);
// }

// function broadcastCmd(client, data) {
//  switch (data.type) {
//    case 'emote':
//      client.broadcast.emit('cmd', color(`${data.nick} ${data.message}`, 'green'));
//      break;
//    default:
//      console.log('unknown command', data);
//  }
// }

io.on('connection', client => {
  client.on('login', data => eventHandlers.login(client, data));
  client.on('register', data => eventHandlers.register(client, data));
  client.on('cmd', auth(client, eventHandlers.cmd));
  client.on('msg', auth(client, eventHandlers.msg));

  client.on('disconnect', () => {
    console.log(`${(client.username || 'unknown user')} disconnected`);
  });
});


io.listen(3000);
