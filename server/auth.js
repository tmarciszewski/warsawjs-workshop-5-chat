'use strict';

const jwt = require('jwt-simple');
const secret = require('./settings.js').authTokenSecret;

function authenticate(client, successFn) {
  return function(event) {
    let decoded;
    try {
      decoded = jwt.decode(event.token, secret);
    } catch (ex) {
      return client.emit('msg', ex.message);
    }
    event.nick = decoded.user.nick;
    return successFn(client, event);
  };
}

module.exports = authenticate;
