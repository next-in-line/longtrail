const {RedisClient} = require('redis')
const asyncRedis = require('async-redis')
const createClient = require('./createClient')

class Redis extends RedisClient {
    set(key, value, callback){
        if(!key) throw new Error('Key must not be undefined')
        if(!value) throw new Error('Value must not be undefined')

        return new Promise((resolve, reject)=>{
            const _callback = (err)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(true)
                }
            }

            return super.set(key, value, callback || _callback)
        })
    }

    get(key){
        if(!key) throw new Error('Key must not be undefined')

        return new Promise((resolve, reject)=>{
            super.get(key, (err, data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    }

    get json(){
        return {
            set: (key, value)=>{
                return this.set(key, JSON.stringify(value))
            },
            get: async(key)=>{
                if(!key) throw new Error('Key must not be undefined')
                const value = await this.get(key)

                return JSON.parse(value)
            }
        }
    }

}

module.exports = {
    createRedisBase: (base)=>{
        return asyncRedis.decorate(
            new Redis(createClient(base.config.redis))
        )
    },
    Redis
}