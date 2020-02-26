// Update with your config settings.

module.exports = {

  test: {
    client: 'postgresql',
    connection: {
      database: 'longtrail_test'
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
