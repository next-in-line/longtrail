const support = require('../support')
const {v4} = require('uuid')
describe('Store Tests', ()=>{
    test('Store.set and Store.get', async() => {
        const app = support.app()
        const Store = app.lib.Store
        await Store.set('here', 'there')
        const testB = await Store.get('here')
        expect(
            testB
        ).toBe('there');
    });

    test('yourStore.set() and yourStore.get()', async() => {
        const app = support.app()
        const Store = app.lib.Store
        const here = new Store('here')
        here.set('there')
        const testB = await here.get()


        expect(
            testB
        ).toBe('there');
    });

    test('yourStore.set() and yourStore.get()', async() => {
        const app = support.app()
        const Store = app.lib.Store
        const here = new Store()
        let testA = false;    

        try{
            here.set('there')
        }catch(error){
            testA = true
        }
        expect(
            testA
        ).toBeTruthy();

        let testB = false;
        try{
            here.get()
        }catch(error){
            testB = true
        }
        expect(
            testB
        ).toBeTruthy();
    });
})