module.exports = {
    createStoreBase: (base)=>{
        return class Store {
            constructor(storeName){
                this.storeName = storeName
            }
            set(value){
                if(!this.storeName) throw new Error('storeName must be provided')

                return this.constructor.set(this.storeName, value)   
            }
            get(){
                if(!this.storeName) throw new Error('storeName must be provided')

                return this.constructor.get(this.storeName)   
        
            }
            static async set(key, value){
                return !!await base.lib.redis.json.set(key, value)
            }
            static get(key){
                return base.lib.redis.json.get(key)
            }
        }
    }
}