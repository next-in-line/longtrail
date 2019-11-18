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

describe('Supervisors',()=>{
    test('Should load and run', async() => {  
        support.prepare()
        const Supervisor = support.app().lib.processors.Supervisor
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
                if(this.props.count == 12) test.resolve(this.props.count)

                if(this.props.count == 12){
                    this.props.quit = true
                }else{
                    if(!this.props.count) this.props.count = 0
                    this.props.count += 1
                }
                return true
            }
        }
        await MyWorker.mount()
        
        class MySupervisor extends Supervisor{
            constructor(props){
                super(props)
            }

            static get processorKey(){
                return `mySupervisor-${testID}`
            }

            get workers(){
                if(this.props.quit){
                    return []
                }else{
                    return [
                        MyWorker,
                        MySupervisor
                    ]
                }
            }
        }
        await MySupervisor.mount()
        MySupervisor.start()
        
        expect(
            await test
        ).toBe(12)
    })
    test('Should run in order', async() => {  
        support.prepare()
        const Supervisor = support.app().lib.processors.Supervisor
        const Worker = support.app().lib.processors.Worker

        const test = Promise.defer();

        const testID = v4()


        class MyWorker1 extends Worker{
            constructor(props){
                super(props)
            }
            
            static get processorKey(){
                return `myWorker1-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker1'
                ]
            }
        }
        await MyWorker1.mount()

        class MyWorker2 extends Worker{
            constructor(props){
                super(props)
                
            }
            
            static get processorKey(){
                return `myWorker2-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker2'
                ]
            }
        }
        await MyWorker2.mount()

        class MyWorker3 extends Worker{
            constructor(props){
                super(props)
                
            }
            
            static get processorKey(){
                return `myWorker3-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker3'
                ]
            }
        }
        await MyWorker3.mount()
        
        class MySupervisor extends Supervisor{
            constructor(props){
                super(props)
                this.props.workers = this.props.workers || [];
            }

            static get processorKey(){
                return `mySupervisor-${testID}`
            }

            get workers(){
                if(this.props.quit){
                    return []
                }else{
                    return [
                        MyWorker1,
                        MyWorker2,
                        MyWorker3
                    ]
                }
            }
            async process(){
                if(this.props.workers.length == 3){
                    test.resolve(this.props.workers.join('.'))
                    this.props.quit = true
                }
            }
        }
        await MySupervisor.mount()
        MySupervisor.start()
        
        expect(
            await test
        ).toBe('myWorker1.myWorker2.myWorker3')
    })
    test('Should run the correct amount instant', async() => {  
        support.prepare()
        const Supervisor = support.app().lib.processors.Supervisor
        const Worker = support.app().lib.processors.Worker

        const test = Promise.defer();

        const testID = v4()


        class MyWorker1 extends Worker{
            constructor(props){
                super(props)
            }
            
            static get processorKey(){
                return `myWorker1-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker1'
                ]
            }
        }
        await MyWorker1.mount()

        class MyWorker2 extends Worker{
            constructor(props){
                super(props)
                
            }
            
            static get processorKey(){
                return `myWorker2-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker2'
                ]
            }
        }
        await MyWorker2.mount()

        class MyWorker3 extends Worker{
            constructor(props){
                super(props)
                
            }
            
            static get processorKey(){
                return `myWorker3-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker3'
                ]
            }
        }
        await MyWorker3.mount()
        
        class MySupervisor extends Supervisor{
            constructor(props){
                super(props)
                this.props.workers = this.props.workers || [];
            }

            static get processorKey(){
                return `mySupervisor-${testID}`
            }

            get workers(){
                if(this.props.quit){
                    return []
                }else{
                    return [
                        MyWorker1,
                        MyWorker2,
                        MyWorker3
                    ]
                }
            }
            async process(){
                if(this.props.workers.length == 3){
                    test.resolve(this.props.workers.join('.'))
                    this.props.quit = true
                }
            }
        }
        await MySupervisor.mount()
        for(let i = 0; i < 10; i++){
            MySupervisor.start()
        }
        
        expect(
            await test
        ).toBe('myWorker1.myWorker2.myWorker3')
    })
    test('Should run the correct amount instant', async() => {  
        support.prepare()
        const Supervisor = support.app().lib.processors.Supervisor
        const Worker = support.app().lib.processors.Worker

        const test = Promise.defer();

        const testID = v4()


        class MyWorker1 extends Worker{
            constructor(props){
                super(props)
            }
            
            static get processorKey(){
                return `myWorker1-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker1'
                ]
            }
        }
        await MyWorker1.mount()

        class MyWorker2 extends Worker{
            constructor(props){
                super(props)
                
            }
            
            static get processorKey(){
                return `myWorker2-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker2'
                ]
            }
        }
        await MyWorker2.mount()

        class MyWorker3 extends Worker{
            constructor(props){
                super(props)
                
            }
            
            static get processorKey(){
                return `myWorker3-${testID}`
            }
            async process(){
                this.props.workers = [
                    ...this.props.workers,
                    'myWorker3'
                ]
            }
        }
        await MyWorker3.mount()
        
        class MySupervisor extends Supervisor{
            constructor(props){
                super(props)
                this.props.workers = this.props.workers || [];
            }

            static get processorKey(){
                return `mySupervisor-${testID}`
            }

            get workers(){
                if(this.props.quit){
                    return []
                }else{
                    return [
                        MyWorker1,
                        MyWorker2,
                        MyWorker3
                    ]
                }
            }
            async process(){
                if(this.props.workers.length == 3){
                    test.resolve(this.props.workers.join('.'))
                    this.props.quit = true
                }
            }
        }
        await MySupervisor.mount()
        for(let i = 0; i < 10; i++){
            MySupervisor.start()
        }
        
        expect(
            await test
        ).toBe('myWorker1.myWorker2.myWorker3')
    })
})