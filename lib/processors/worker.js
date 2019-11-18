
const uuid = require('uuid').v4
const _ = require('lodash')

module.exports = {
    createWorkerBase: (base)=>{
        if(!_.get(base,'lib.processors.Processor')){
            throw new Error(`WorkerBase must not be createded before ProcessorBase`)
        }
        class Worker extends base.lib.processors.Processor{
           
            static async start(props = {}, args){
                if(!this.processorKey){
                    throw new Error('Processor Key must be defined')
                }
                const instance = new this(props)
                if(!instance.seriesKey){
                    throw new Error('Series Key must be defined')
                }
                const check = await base.lib.redis.get(instance.seriesKey)
        
                if(Object(check).uuid){
                    const lastPingAgo = moment.duration(this.now - check.timeout, 'milliseconds').asMinutes()
                    if(lastPingAgo > 2){
                        base.lib.redis.del(instance.seriesKey)
                    }
                }else{
                    const _uuid = uuid()
        
                    await instance.status.set({
                        uuid: _uuid,
                        ping: this.now
                    })
        
                    const _check = await instance.status.get()
        
                    if(_check.uuid == _uuid){
                        this.dispatch({
                            ...props,
                            solo: true
                        })
                    }
                }
            }
            
            onComplete(){
                const processorKey = _.get(this, 'props.supervisor.processorKey');
        
                if(processorKey){
                    const driver = new base.lib.processors.Driver(processorKey)
                    const job = driver.dispatch({
                        ...this.props
                    })
            
                    return job;
                }else if(!this.props.solo){
                    throw new Error('Worker Needs Supervisor Processor Key')
                }
            }
        }
        return Worker;
    }
}