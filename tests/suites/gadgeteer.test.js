const support = require('../support')

test('Should load up the entire library', () => {  
  support.prepare()

  expect(
    Object.keys(support.app())
  ).toMatchObject(
    ['lib', 'config']
  );
});