module.exports = {
  production: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './db/chat_users.db'
    },
    migrations: {
      directory: './db/migrations'
    }
  }
};
