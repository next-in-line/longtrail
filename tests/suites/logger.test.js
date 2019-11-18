const support = require('../support')
const {v4} = require('uuid')

describe('Redis CreateClient Tests', ()=>{
  test('logger.level', async() => {
      const logger = support.app().lib.logger

      logger.broker.level = 800

      expect(
          logger.broker.level
      ).toBe(800);
  });

  test('logger.warn', async() => {
      const logger = support.app().lib.logger

      logger.broker.level = 800

      warn = global.console.warn
      let testB
      
      global.console.warn = (...data)=>{
        testB = data      
      }
      
      logger.warn({
        type: ['here', 'there'], message: 'hello there'
      })

      global.console.warn = warn

      expect(
        testB
      ).toMatchObject([
        '\u001b[33m\n',
        'hello there',
        '\u001b[0m',
        '\n',
        'tests/suites/logger.test.js:23',
        ' ',
        [ 'here', 'there' ],
        '\n' 
      ]);
  });

  test('logger.error', async() => {
      const logger = support.app().lib.logger

      logger.broker.level = 800

      const error = global.console.error
      let testB
      
      global.console.error = (...data)=>{
        testB = data      
      }
      
      logger.error({
        type: ['here', 'there'], message: 'hello there'
      })

      global.console.error = error
      
      expect(
        testB
      ).toMatchObject([
        '\u001b[31m\n',
        'hello there',
        '\u001b[0m',
        '\n',
        'tests/suites/logger.test.js:40',
        ' ',
        [ 'here', 'there' ],
        '\n' 
      ]);
  });

  test('logger.fatal', async() => {
      const logger = support.app().lib.logger

      logger.broker.level = 800

      const error = global.console.error
      let testB
      
      global.console.error = (...data)=>{
        testB = data      
      }
      
      logger.fatal({
        type: ['here', 'there'], message: 'hello there'
      })

      global.console.error = error
      
      expect(
        testB
      ).toMatchObject([
        '\u001b[31m\n',
        'hello there',
        '\u001b[0m',
        '\n',
        'tests/suites/logger.test.js:57',
        ' ',
        [ 'here', 'there' ],
        '\n' 
      ]);
  });

  test('logger.info', async() => {
      const logger = support.app().lib.logger

      logger.broker.level = 800

      const info = global.console.info
      let testB
      
      global.console.info = (...data)=>{
        testB = data      
      }
      
      logger.info({
        type: ['here', 'there'], message: 'hello there'
      })

      global.console.info = info
      
      expect(
        testB
      ).toMatchObject([
        '\u001b[36m\n',
        'hello there',
        '\u001b[0m',
        '\n',
        'tests/suites/logger.test.js:74',
        ' ',
        [ 'here', 'there' ],
        '\n' 
      ]);
  });

  test('logger.ping', async() => {
      const logger = support.app().lib.logger

      logger.broker.level = 800

      const info = global.console.info
      let testB
      
      global.console.info = (...data)=>{
        testB = data      
      }
      
      logger.ping()

      global.console.info = info
      
      expect(
        testB
      ).toMatchObject([
        'ping:',
        'tests/suites/logger.test.js:91'
      ]);
  });

  test('logger.log', async() => {
      const logger = support.app().lib.logger

      logger.broker.level = 800

      const info = global.console.info
      let testB
      
      global.console.info = (...data)=>{
        testB = data      
      }
      
      logger.log({
        type: ['here', 'there'], message: 'hello there'
      })

      global.console.info = info
      
      expect(
        testB
      ).toMatchObject([
        '\u001b[2m\n',
        'hello there',
        '\u001b[0m',
        '\n',
        'Carsons-MacBook-Pro.local ',
        'tests/suites/logger.test.js:105',
        ' ',
        '[\'',
        'here\', \'there',
        '\']',
        '\n'
      ]);
  });

  test('logger.test', async() => {
      const logger = support.app().lib.logger

      logger.broker.level = 800

      const info = global.console.info
      let testB
      
      global.console.info = (...data)=>{
        testB = data      
      }
      
      logger.test('hello there')

      global.console.info = info
      
      expect(
        testB
      ).toMatchObject([
        '\u001b[2m\n',
        'hello there',
        '\u001b[0m ',
        'tests/suites/logger.test.js:122',
        '\n' 
      ]);
  });

  test('logger.debug', async() => {
    const logger = support.app().lib.logger

    logger.broker.level = 800

    const debug = global.console.debug
    let testB
    
    global.console.debug = (...data)=>{
      testB = data      
    }
    
    logger.broker.debug('hello there')

    global.console.debug = debug

    expect(
      testB
    ).toMatchObject([ 'hello there' ]);
  });

  test('logger.trace', async() => {
    const logger = support.app().lib.logger

    logger.broker.level = 800

    const trace = global.console.trace
    let testB
    
    global.console.trace = (...data)=>{
      testB = data      
    }
    
    logger.broker.trace('hello there')

    global.console.trace = trace

    expect(
      testB
    ).toMatchObject([ 'hello there' ]);
  });
})