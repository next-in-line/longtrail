const {v4} = require('uuid').v4;
const moment = require('moment')
const _ = require('lodash')

module.exports = {
    createSupervisorBase: (base)=>{
        if(!_.get(base,'lib.processors.Processor')){
            throw new Error(`SupervisorBase requires lib.processors.Processor`)
        }
        if(!_.get(base,'lib.redis')){
            throw new Error(`SupervisorBase requires lib.redis`)
        }

        class Supervisor extends base.lib.processors.Processor {
            constructor(props){
                super(props)
            }
            get seriesKey(){
                return this.constructor.processorKey
            }
            process(){
        
            }
            async execute(){
                let life = this.startLife()
        
                try{
                    await this.process()
                }catch(error){
                    base.lib.logger.error({
                        type: ['Supervisor', this.processorKey],
                        message: error.stack
                    })
                }
                
                try{
                    let status = await this.status.get()
                    if(this.props.uuid == status.uuid){
                        for(let [i, worker] of this.workers.entries()){
                            let props;
            
                            this.setProgress(i, this.workers.length)
                            if(worker.name == this.action){
                                if(this.workers.length - 1 == i) {
                                    i = 0
                                }else if(this.workers.length > 1) i++
                                
                                const nextWorker = this.workers[i]
                                
                                if(this.constructor.name == nextWorker.name || !this.props.loopCount){
                                    props = {
                                        loopCount: (this.props.loopCount || 0) + 1
                                    }
                                }
                                
                                const config = Object(base.config)
                                const _options = {
                                    delay: Object(config).delay || this.delay
                                }
                                if(config.test) delete _options.delay
                                
                                nextWorker.dispatch({
                                    ...this.props,
                                    supervisor: {
                                        processorKey: this.constructor.processorKey
                                    },
                                    ...props,
                                    action: nextWorker.name
                                }, _options)
                            }
                        }   
                    }
                    clearInterval(life)
                }catch(error){
                    base.lib.logger.error({
                        type: ['Supervisor', this.pocessorKey],
                        message: error.stack
                    })
                }
            }
        
            get action(){
                return this.props.action || (this.workers[this.workers.length - 1] || {}).name
            }
        
            get delay(){
                return this.props.delay || 10000
            }
        
            async isDead(){
                const seriesKey = this.seriesKey
                const check = await this.status.get()
                
                if(Object(check).uuid){
                    const lastPingAgo = moment.duration(this.now - check.ping, 'milliseconds').asMinutes()
                    if(lastPingAgo > 2){
                        await base.lib.redis.del(seriesKey)
                        return true
                    }
                    return false
                }
                return true
            }
        
            static start(props = {}){
                return (async()=>{
        
                    if(!this.processorKey){
                        throw new Error('Processor Key must be defined')
                    }
                    const instance = new this(props)
                    const seriesKey = instance.seriesKey
        
                    if(await instance.isDead()){
                        const uuid = v4()
        
                        await instance.status.set({
                            uuid,
                            ping: this.now
                        })

                        instance.uuid = uuid
                        const check = await base.lib.redis.json.get(seriesKey)
                        
                        if(check.uuid == uuid){
                            this.dispatch({
                                uuid: uuid,
                                loopCount: 0,
                                ...props
                            })
                        }
                    }
        
                })()
            }
        }
        return Supervisor
    }   
}