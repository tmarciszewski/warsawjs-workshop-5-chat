'use strict';
const io = require('socket.io')();
const color = require("ansi-color").set;
const jwtGenerator = require('./jwtGenerator'); // to chyba
const db = require('../db/model.js'); //to chyba
const auth = require('./auth.js');
const eventHandlers = require('./socketEventHandlers');

function broadcastMessage(client, data){
  client.broadcast.emit('msg', color(`${data.nick}: `, 'green') + data.message);
}

function broadcastCmd(client, data) {
  switch(data.type) {
    case 'emote':
      io.emit('cmd', color(`${data.nick} ${data.message}`, 'green'));
      break;
    default:
      console.log('unknown command', data);
  }
}

io.on('connection', client => {
    client.on('login', data => eventHandlers.login(client, data));
    client.on('register', data => eventHandlers.register(client, data));
    // client.on('register', data => {
    //   db.registerUser(data.username, data.password)
    //     .then(response => {
    //       if(response) {
    //         client.emit('registered', { success: 'Registration complete' });
    //         client.broadcast.emit('cmd', color(`New user registered: ${data.username}`, 'cyan'));
    //       } else {
    //         client.emit('registered', { error: 'Username taken' });
    //       }
    //     })
    // });

    client.on('cmd', auth(client, broadcastCmd));
    client.on('msg', auth(client, broadcastMessage));

    client.on('disconnect', () => {
      console.log((client.username || 'unknown user') + ' disconnected');
    });
});


io.listen(3000);