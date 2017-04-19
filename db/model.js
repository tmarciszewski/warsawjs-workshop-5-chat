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

        const userData = { username, password: hashPassword(password) };
        return db.table('users')
          .insert(userData)
          .then(insertedIDs => insertedIDs[0]);
      });
  },

  loginUser(username, password) {
    return getUser(username)
      .then(dbUser => {
        if (dbUser) {
          return bcrypt.compareSync(password, dbUser.password) ? dbUser : false;
        }

        return false;
      });
  }
};
