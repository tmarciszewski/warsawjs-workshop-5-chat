'use strict';

const db = require('./db.js');
const bcrypt = require('bcryptjs');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function getUser(username) {
  return db.table('users').where({ username }).first();
}

function isUserNameTaken(username) {
  return getUser(username)
    .then(user => Boolean(user));
}

module.exports = {
  registerUser(username, password) {
    return isUserNameTaken(username)
      .then(isTaken => {
        if (isTaken) {
          return false;
        }

        return db.table('users')
          .insert({ username, password: hashPassword(password) })
          .then(insertedIDs => insertedIDs[0]);
      });
  },

  loginUser(username, password) {
    return getUser(username)
      .then(dbUser => {
        if (!dbUser) {
          return false;
        }
        
        return bcrypt.compare(password, dbUser.password)
            .then((res) => res ? dbUser : false)
            .catch(() => false);
      });
  }
};
