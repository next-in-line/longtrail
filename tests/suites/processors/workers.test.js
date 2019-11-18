const support = require('../../support')
const {v4} = require('uuid')

Promise.defer = Promise.defer || (()=>{
    let resolve;
    const promise = new Promise((_resolve, _reject)=>{
        resolve = _resolve
        reject = _reject
    });
    promise.resolve = resolve
    promise.reject = reject
    return promise;
})

describe('Workers',()=>{
    test('Should run with start', async() => {  
        support.prepare()
        const Worker = support.app().lib.processors.Worker

        const test = Promise.defer();

        const testID = v4()


        class MyWorker extends Worker{
            constructor(props){
                super(props)
            }
            
            static get processorKey(){
                return `myWorker-${testID}`
            }
            async process(){
                test.resolve(this.props)
            }
        }
        await MyWorker.mount()
        MyWorker.start()

        await 
        expect(
            await test
        ).toMatchObject({
            solo: true
        })
    })
})