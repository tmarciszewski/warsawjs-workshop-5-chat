"use strict";

const db = require('./db.js');
// const createHash = require('sha.js');
const bcrypt = require('bcryptjs');

function hashPassword(password) {
  // let sha256 = createHash('sha256');
  // return sha256.update(password, 'utf8').digest('hex');
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function getUser(username) {
  return db.table('users').where({username}).first();
}

function isUserNameTaken(username) {
  return getUser(username)
    .then((user) => Boolean(user) );
}

module.exports = {
  registerUser(username, password) {
    return isUserNameTaken(username)
      .then((isTaken) => {
        if (isTaken) {
          return false;
        } else {
          const userData = {username, password: hashPassword(password)};
          return db.table('users')
            .insert(userData)
            .then(insertedIDs => insertedIDs[0]);
        }
      });
  },
  
  loginUser(username, password) {
    return getUser(username)
      .then(dbUser => {
        if (dbUser) {
          return bcrypt.compareSync(password, dbUser.password) ? dbUser : false;
        } else {
            return false
        }
      });
  }
}