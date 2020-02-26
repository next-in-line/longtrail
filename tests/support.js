const longtrail = require('../index')
const {Client} = require('pg')
const app = ()=>(
  longtrail.init({
    test: true,
    database: {
      client: 'pg',
      asyncStackTraces: true,
      // version: '7.2',
      connection: {
          database: 'longtrail_test'
      },
      migrations: {
        directory: './tests/migrations'
      }
    },
    processors: {
      delay: 0
    }
  })
)


module.exports = {
  longtrail,
  prepare: async()=>{

  },
  app
}