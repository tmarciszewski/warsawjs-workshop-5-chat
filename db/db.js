'use strict';

const ENV = process.env.NODE_ENV || 'production';
const config = require('../knexfile.js')[ENV];
const knex = require('knex')(config);

module.exports = knex;

knex.migrate.latest(config);
