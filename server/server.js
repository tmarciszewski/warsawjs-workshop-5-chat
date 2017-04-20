'use strict';

const io = require('socket.io')();
const auth = require('./auth.js');
const eventHandlers = require('./socketEventHandlers');

io.on('connection', client => {
  console.log('New client connected');
  client.on('login', data => eventHandlers.login(client, data));
  client.on('register', data => eventHandlers.register(client, data));
  client.on('cmd', auth(client, eventHandlers.cmd));
  client.on('msg', auth(client, eventHandlers.msg));

  client.on('disconnect', () => {
    console.log(`${(client.username || 'unknown user')} disconnected`);
  });
});


io.listen(3000);
