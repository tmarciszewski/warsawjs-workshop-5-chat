"use strict";

exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('username');
        table.string('password', 64);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
