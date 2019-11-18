// Update with your config settings.

module.exports = {

  test: {
    client: 'postgresql',
    connection: {
      database: 'gadgeteer_test'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './tests/migrations'
    }
  },
};
