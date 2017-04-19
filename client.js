'use strict';

const io = require('socket.io-client')
const socket = io('http://localhost:3000');
const color = require("ansi-color").set;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let nick;
let authToken;

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    readline.prompt(true);
}

function chatCommand(cmd, arg) {
  switch (cmd) {
    case 'login':
      let loginArgs = arg.split(' ');
      socket.emit('login', { username: loginArgs[0], password: loginArgs[1] })
      readline.prompt();
      break;
    case 'register':
      let registerArgs = arg.split(' ');
      socket.emit('register', {username: registerArgs[0], password: registerArgs[1]})
      readline.prompt();
      break;
    case 'me':
      socket.emit('cmd', { type: 'emote', token: authToken, message: arg });
      break;
    default:
      console_out("That is not a valid command.");
  }
}

readline.on('line', function (line) {
  if(!nick && !line.startsWith('/login') && !line.startsWith('/register')) {
    return console_out('Use /login <username> command to log in first')
  }

  if (line[0] == "/" && line.length > 1) {
    const cmd = line.match(/[a-z]+\b/)[0];
    const arg = line.substr(cmd.length+2, line.length);

    chatCommand(cmd, arg);
  } else {
    socket.emit('msg', { type: 'msg', message: line, token: authToken });
    readline.prompt(true);
  }
});

socket.on('registered', data => {
  if(data.error) {
    return console_out(data.error);
  }
  return console_out(data.success);
});

socket.on('loggedin', data => {
  if(data.error) {
    return console_out(data.error);
  }
  console_out('Login successful!');
  nick = data.username;
  authToken = data.token;
  
  readline.setPrompt(color(`${nick}: `, 'red'));
  // readline.setPrompt(`${nick}: `);
  readline.prompt();
});

socket.on('msg', data => {
  console_out(data);
});

socket.on('cmd', data => {
  console_out(data);
});

console.log('Log in with command: /login <username>');
readline.prompt();

