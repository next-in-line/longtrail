const createClient = require('../../lib/redis/createClient')
const {v4} = require('uuid')


describe('Redis CreateClient Tests', ()=>{
    test('redis.createClient([Accepts url])', async() => {
        const redis = createClient('redis://localhost:9323')

        expect(
            redis
        ).toMatchObject({
            "host": "localhost",
            "port": "9323",
            "tls": {}
        });
    });

    test('redis.createClient([accepts number port and host])', async() => {
        const redis = createClient(9323, 'localhost')

        expect(
            redis
        ).toMatchObject({
            host: 'localhost',
            port: 9323
        });
    });

    test('redis.createClient(errors on bad data)', async() => {
        let test = false
        try{
            createClient(9323, 111, {h: 1})
        }catch(error){
            test = error
        }

        
        expect(
            test.message
        ).toBe('Unknown type of connection in createClient()');
    });

    test('redis.createClient(options as second argument)', async() => {
        let test = createClient(9323, {host: 'test'})
        
        expect(
            test
        ).toMatchObject({"host": 'test', "port": 9323});
    });

    test('redis.createClient(options as first argument with url)', async() => {
        let test = createClient({url: 'test', host: 'test', port: 9323})
        
        expect(
            test
        ).toMatchObject({"host": 'test', "port": 9323});
    });

    test('redis.createClient(string with auth)', async() => {
        let test = createClient('redis://myusername:mypassword@example.com:9334')
        
        expect(
            test
        ).toMatchObject({"host": "example.com", "password": "mypassword", "port": "9334", "tls": {}});
    });

    test('redis.createClient(string with bad protocol)', async() => {
        const warn = console.warn
        let testA = false
        console.warn = (warning)=>{
            testA = warning
        }
        let testB = createClient('http://example.com:9334')
        console.warn = warn
        
        expect(
            testA
        ).toBe('node_redis: WARNING: You passed \"http\" as protocol instead of the \"redis\" protocol!');

        expect(
            testB
        ).toMatchObject({
            "host": "example.com",
            "port": "9334"
        });    
    });


    test('redis.createClient(string with db)', async() => {
        let test = createClient('redis://example.com:9334/0')
        
        expect(
            test
        ).toMatchObject({"db": "0", "host": "example.com", "port": "9334", "tls": {}});
    });

    test('redis.createClient(string with conflicting query params)', async() => {
        let error
        try{
            let test = createClient('redis://shouldbethis.example.com:9334/0?host=shouldnotbethis')
        }catch(_error){
            error = _error
        }
        
        expect(
            error.message
        ).toBe('The host option is added twice and does not match');
    });

    test('redis.createClient(string with duplicate query params)', async() => {
        const warn = console.warn
        let testA = false
        console.warn = (warning)=>{
            testA = warning
        }
        let testB = createClient('redis://shouldbethis.example.com:9334/0?host=shouldbethis.example.com')
        console.warn = warn
        
        
        expect(
            testA
        ).toBe('node_redis: WARNING: You passed the host option twice!');
    });

    test('redis.createClient(string without // at beginning)', async() => {
        let testA, testB;
        try{
            testB = createClient('shouldbethis.example.com:9334/0?host=shouldbethis.example.com')

        }catch(error){
            testA=error
        }
        
        expect(
            testA.message
        ).toBe('The redis url must begin with slashes "//" or contain slashes after the redis protocol');
        
        
        expect(
            testB
        ).toBeUndefined();
    })

    test('redis.createClient(Object with extra arguments)', async() => {
        let testA, testB;
        try{
            testB = createClient({}, {})

        }catch(error){
            testA=error
        }
        
        expect(
            testA.message
        ).toBe('Too many arguments passed to createClient. Please only pass the options object');
        
        expect(
            testB
        ).toBe();
    })

    test('redis.createClient(Object with camelCase)', async() => {
        let testA;
        testA = createClient({localHost: 'here'})
        
        expect(
            testA
        ).toMatchObject({"camel_case": true, "local_host": "here"});
    })

    test('redis.createClient(object with tls)', async() => {
        let testA;
        testA = createClient({tls: {here: 'we are'}})
        
        expect(
            testA
        ).toMatchObject({tls: {
            here: 'we are'
        }});
    })

    test('redis.createClient(object with Array)', async() => {
        let testA;
        testA = createClient([{}])
        
        expect(
            testA
        ).toMatchObject([{}]);
    })
})
