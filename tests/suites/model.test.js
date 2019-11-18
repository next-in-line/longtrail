const support = require('../support')
const {v4} = require('uuid')


describe('Model Tests', ()=>{
  beforeAll(support.prepare)

  test('Model.create', async() => {

      class Test extends support.app().lib.Model{
        static get tableName(){
          return 'tests'
        }
      }
    
      const name = 'Here ' + v4()
      test = await Test.create({
        name: name,
        description: 'Golden'
      })
      
    
      expect(
        test
      ).toMatchObject({
          name: name,
          description: 'Golden'
      });
  });

  test('Model.findBy', async() => {

      class Test extends support.app().lib.Model{
        static get tableName(){
          return 'tests'
        }
      }

      const name = 'Here ' + v4()
      await Test.create({
        name,
        description: 'Golden'
      })    
      test = await Test.findBy({
        name
      })    
    
      expect(
        test
      ).toMatchObject({
          name,
          description: 'Golden'
      });
  });

  test('Model.findBy', async() => {
      class Test extends support.app().lib.Model{
        static get tableName(){
          return 'tests'
        }
      }
    
      const name = 'Here ' + v4()
      await Test.create({
        name,
        description: 'Golden'
      })    
      test = await Test.findBy({
        name
      })    
    
      expect(
        test
      ).toMatchObject({
          name,
          description: 'Golden'
      });
  });

  test('Model.where', async() => {
      class Test extends support.app().lib.Model{
        static get tableName(){
          return 'tests'
        }
      }
    
      const name = 'Here ' + v4()
      await Test.create({
        name,
        description: 'Golden'
      })    
      test = await Test.where({
        name
      })    
    
      expect(
          test
      ).toMatchObject([{
          name,
          description: 'Golden'
      }]);
  });


  test('Model.all', async() => {
      class Test extends support.app().lib.Model{
        static get tableName(){
          return 'tests'
        }
      }
    
      const name = 'Here ' + v4()
      await Test.create({
        name,
        description: 'Golden'
      })    
      
      testA = await Test.all()    
      testB = await Test.query().select('*')    
    
      expect(
          testA.length
      ).toBeGreaterThan(1)
      expect(
          testA
      ).toMatchObject(
          testB
      );
  });

  test('Model.update', async() => {
      class Test extends support.app().lib.Model{
        static get tableName(){
          return 'tests'
        }
      }
    
      const nameA = 'Here ' + v4()
      testA = await Test.create({
          name: nameA,
          description: 'Golden'
      })
      const nameB = 'Here ' + v4()
      await testA.update({
          name: nameB
      })
      testB = await Test.findBy({ id: testA.id })
    
      expect(
          testA.name
      ).toBe(nameA)
      expect(
          testB.name
      ).toBe(
          nameB
      );
  });

  test('Model.destroy', async() => {
      class Test extends support.app().lib.Model{
        static get tableName(){
          return 'tests'
        }
      }
    
      const name = 'Here ' + v4()
      const testA = await Test.create({
          name,
          description: 'Golden'
      })
    
      await testA.destroy()

      const testB = await Test.findBy({ id: testA.id })
    
      expect(
          testA.id
      ).not.toBeNull()
      
      expect(
          testB
      ).not.toBeDefined();
  });
})