'use strict';
const db = require('../db/model.js');
const color = require("ansi-color").set;
const jwtGenerator = require('./jwtGenerator');

module.exports = {
  login(client, data) {
    db.loginUser(data.username, data.password)
      .then(response => {
        if(!response) {
          return client.emit('loggedin', { error: 'Username and password combination not recognized.' });
        }

        client.username = data.username;
        return client.emit('loggedin', { token: jwtGenerator.get(response), username: data.username });
      });
  },

  register(client, data) {
    db.registerUser(data.username, data.password)
        .then(response => {
          if(response) {
            client.emit('registered', { success: 'Registration complete' });
            client.broadcast.emit('cmd', color(`New user registered: ${data.username}`, 'cyan'));
          } else {
            client.emit('registered', { error: 'Username taken' });
          }
        })
  }
};
