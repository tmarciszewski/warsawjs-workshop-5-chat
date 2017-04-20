'use strict';

const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const color = require('ansi-color').set;
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let nick;
let authToken;

function consoleOut(msg) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(msg);
  readline.prompt(true);
}

function chatCommand(cmd, arg) {
  switch (cmd) {
    case 'login': {
      const loginArgs = arg.split(' ');
      socket.emit('login', { username: loginArgs[0], password: loginArgs[1] });
      readline.prompt();
      break;
    }
    case 'register': {
      const registerArgs = arg.split(' ');
      socket.emit('register', { username: registerArgs[0], password: registerArgs[1] });
      readline.prompt();
      break;
    }
    case 'me': {
      socket.emit('cmd', { type: 'emote', token: authToken, message: arg });
      break;
    }
    default:
      consoleOut('That is not a valid command.');
  }
}

readline.on('line', line => {
  if (!nick && !line.startsWith('/login') && !line.startsWith('/register')) {
    return consoleOut('Use /login <username> <password> command to log in first');
  }

  if (line[0] === '/' && line.length > 1) {
    const cmd = line.match(/[a-z]+\b/)[0];
    const arg = line.substr(cmd.length + 2, line.length);

    readline.prompt(true);
    return chatCommand(cmd, arg);
  }

  socket.emit('msg', { type: 'msg', message: line, token: authToken });
  return readline.prompt(true);
});

socket.on('registered', data => {
  if (data.error) {
    return consoleOut(data.error);
  }
  return consoleOut(data.success);
});

socket.on('loggedin', data => {
  if (data.error) {
    return consoleOut(data.error);
  }
  consoleOut('Login successful!');
  nick = data.username;
  authToken = data.token;

  readline.setPrompt(color(`${nick}: `, 'red'));
  return readline.prompt();
});

socket.on('msg', data => {
  consoleOut(data);
});

socket.on('cmd', data => {
  consoleOut(data);
});

console.log('Log in with command: /login <username>');
readline.prompt();

