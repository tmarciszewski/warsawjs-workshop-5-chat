'use strict';
const io = require('socket.io')();


io.on('connection', client => {
    console.log(`Client with ID: ${client.id} connected!`);

    client.on('cmd', data => {
      console.log('cmd', data);
      switch(data.type) {
        case 'emote':
          io.emit('cmd', `${data.nick} ${data.message}`);
          break;
        default:
          console.log('unknown command', data);
      }
    });

    client.on('msg', data => {
      console.log('msg', data)
      io.emit('msg', color(`${data.nick}>`, 'green') + data.message);
    });

    client.on('disconnect', () => {
      console.log('client disconnected');
    });
});


io.listen(3000);