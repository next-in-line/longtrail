const gadgeteer = require('../index')
const {Client} = require('pg')
const app = ()=>(
  gadgeteer.init({
    test: true,
    database: {
      client: 'pg',
      asyncStackTraces: true,
      // version: '7.2',
      connection: {
          database: 'gadgeteer_test'
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
  gadgeteer,
  prepare: async()=>{

  },
  app
}