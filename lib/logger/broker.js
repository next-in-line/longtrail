
const _ = require('lodash')

module.exports = {
    createBrokerBase:(base)=>{
        let level =  _.get(base, 'config.logger.level') || 200
        class Broker {
            static get level(){
                return level
            }
            static set level(_level){
                return level = _level
            }
            static fatal(...args){
                if(this.level >= 100){
                    console.error(...args)
                }
            }
            static error(...args){
                if(this.level >= 200){
                    console.error(...args)
                }
            }
        
            static warn(...args){
                if(this.level >= 300){
                    console.warn(...args)
                }
            }
        
            static info(...args){
                if(this.level >= 400){
                    console.info(...args)
                }
            }
        
            static debug(...args){
                if(this.level >= 500){
                    console.debug(...args)
                }
            }
            
            static trace(...args){
                if(this.level >= 600){
                    console.trace(...args)
                }
            }
            
            // backwords compatible shortcut
            static log(...args){
                this.info(...args)
            }
        }

        return Broker
    }
}