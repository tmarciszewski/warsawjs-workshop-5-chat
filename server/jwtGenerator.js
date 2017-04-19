'use strict';
const jwt = require('jwt-simple');

const secret = require('./settings.js').authTokenSecret;

module.exports = {
  get(user) {
    const payload = {
      sub: user.id,
      user: {
        nick: user.username,
        id: user.id
      },
      iat: new Date().getTime(),
      exp: Math.round((new Date().getTime() + 7200000) / 1000)
    };

    return jwt.encode(payload, secret);
  }
};
