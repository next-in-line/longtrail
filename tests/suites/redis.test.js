const support = require('../support')
const redis = require('redis')
const {v4} = require('uuid')


describe('Redis Tests', ()=>{
    test('redis.set and get', async() => {
        const id = v4()
        await support.app().lib.redis.set(`mykey${id}`, 'myvalue')
        let test = await support.app().lib.redis.get(`mykey${id}`)
        
        expect(
            test
        ).toBe('myvalue');
    })

    test('redis.set failure (undefined value)', async() => {
        let test = false;
        const id = v4()
        try{
            await support.app().lib.redis.set(`mykey${id}`)
        }catch(error){
            test = error
        }

        expect(
            test.message
        ).toBe('Value must not be undefined');
    })

    test('redis.set failure (undefined key)', async() => {
        let test = false;
        try{
            await support.app().lib.redis.set()
        }catch(error){
            test = error
        }

        expect(
            test.message
        ).toBe('Key must not be undefined');
    })

    test('redis.get failure (undefined key)', async() => {
        let test = false;
        try{
            await support.app().lib.redis.get()
        }catch(error){
            test = error
        }

        expect(
            test.message
        ).toBe('Key must not be undefined');
    })

    test('redis.get failure (unknown reason)', async() => {
        let test = false;

        const redisGet = redis.RedisClient.prototype.get;
        redis.RedisClient.prototype.get = (key, cb)=>{
            cb(new Error('My error'))
        }
        const id = v4()

        try{
            await support.app().lib.redis.get(`hello${id}`)
        }catch(error){
            test = error
        }

        redis.RedisClient.prototype.get = redisGet;

        expect(
            test.message
        ).toBe('My error');
    })

    test('redis.json.get failure (undefined key)', async() => {
        let test = false;
        try{
            await support.app().lib.redis.json.get()
        }catch(error){
            test = error
        }

        expect(
            test.message
        ).toBe('Key must not be undefined');
    })
})