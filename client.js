'use strict';

const io = require('socket.io-client')
const socket = io('http://localhost:3000');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let nick;

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    readline.prompt(true);
}

function chatCommand(cmd, arg) {
  switch (cmd) {
    case 'login':
      let args = arg.split(' ');
      nick = args[0];
      readline.setPrompt(`${nick}: `);
      readline.prompt();
      break;
    case 'me':
      socket.emit('cmd', { type: 'emote', nick: nick, message: arg });
      break;
    default:
      console_out("That is not a valid command.");
  }
}

readline.on('line', function (line) {
  if(!nick && !line.startsWith('/login')) {
    return console_out('Use /login <username> command to log in first')
  }

  if (line[0] == "/" && line.length > 1) {
    const cmd = line.match(/[a-z]+\b/)[0];
    const arg = line.substr(cmd.length+2, line.length);

    chatCommand(cmd, arg);
  } else {
    socket.emit('msg', { type: 'msg', message: line, nick: nick });
    readline.prompt(true);
  }
});

socket.on('msg', data => {
  console_out(data);
});

socket.on('cmd', data => {
  console_out(data);
})

console.log('Log in with command: /login <username>');
readline.prompt();

