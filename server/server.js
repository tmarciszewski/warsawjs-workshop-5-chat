'use strict';
const io = require('socket.io')();
const color = require("ansi-color").set;

io.on('connection', client => {
    console.log(`Client with ID: ${client.id} connected!`);

    client.on('cmd', data => {
      console.log('cmd', data);
      switch(data.type) {
        case 'emote':
          io.emit('cmd', color(`${data.nick} ${data.message}`, 'cyan'));
          break;
        default:
          console.log('unknown command', data);
      }
    });

    client.on('msg', data => {
      console.log('msg', data)
      client.broadcast.emit('msg', color(`${data.nick}: `, 'green') + data.message);
    });

    client.on('disconnect', () => {
      console.log('client disconnected');
    });
});


io.listen(3000);