const support = require('../../support')
const {v4} = require('uuid')
// var ipc=require('node-ipc');
 
// ipc.config.id   = 'world';
// ipc.config.retry= 1500;

// ipc.server.start();

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

describe('Prossessors',()=>{
    test('Should load and run', async() => {  
        support.prepare()
        const Processor = support.app().lib.processors.Processor

        const test = Promise.defer()

        const testID = v4()
        class MyProcessor extends Processor{
            constructor(props){
                super(props)
                }
            static get processorKey(){
                return `myProcessor-${testID}`
            }
            async process(){ 
                test.resolve(this.props)
            }
        }
        await MyProcessor.mount()
        
        MyProcessor.dispatch({
            myTest: 'hello'
        })
        
        expect(
            await test
        ).toMatchObject({
            myTest: 'hello'
        })
    })

    test('Should allow "shouldMount"', async()=>{  
        support.prepare()
        const Processor = support.app().lib.processors.Processor
        const test = Promise.defer()
        const testID = v4()
        
        class MyProcessor extends Processor{
            constructor(props){
                super(props)
            }

            static get processorKey(){
                return `myProcessor-${testID}`
            }

            static shouldMount(){
                return false
            }
            static didNotMount(){
                test.resolve(true)
            }

            async process(){ 
                
            }
        }
        await MyProcessor.mount()
        
        MyProcessor.dispatch({
            myTest: 'hello'
        })
        
        expect(
            await test
        ).toBeTruthy()
    })

    test('Should execute correct number"', async()=>{  
        support.prepare()
        const Processor = support.app().lib.processors.Processor
        const testID = v4()
        
        const test=[]
        for(let i=0; i < 10; i++){
            test.push(Promise.defer())
        }
        test.value = 0
        
        class MyProcessor extends Processor{
            constructor(props){
                super(props)
            }

            static get processorKey(){
                return `myProcessor-${testID}`
            }

            async process(){ 
                test[this.props.value].resolve(false)
                test.value += 1
            }
        }
        await MyProcessor.mount()
        
        for(let i=0; i < 10; i++){
            MyProcessor.dispatch({
                value: i
            })
        }
        
        await Promise.all(test)
        expect(
            test.value
        ).toBe(10)
    })
})