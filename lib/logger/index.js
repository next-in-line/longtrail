const stackTrace = require('stack-trace')
const broker = require('./broker')
const os = require('os')

const processMessage = (message)=>{
    if(Array.isArray(message)){
        message = message.map((_)=>{
            return _
        })
    }else if(typeof message == 'object' && !message.constructor.name.includes('Error')){
        // message = JSON.stringify(message, null, 4)
    }
    return message
}



const getLineandNumber = (cwd,frame)=>{
    return `${frame.getFileName().replace(cwd + "/", '')}:${frame.getLineNumber()}`
}

module.exports = {
    createLoggerBase: (base)=>{
        class Logger {
            static get cwd(){
                return process.cwd()
            }
            static isValid (){
                return true
            }
            static ping(){
                const frame = stackTrace.get()[1];

                return base.lib.logger.broker.log('ping:', getLineandNumber(this.cwd, frame));
            }
            static test(...message){
                const frame = stackTrace.get()[1];
                base.lib.logger.broker.log(
                    '\x1b[2m\n', ...processMessage(message), '\x1b[0m ',
                    getLineandNumber(this.cwd, frame), '\n'
                );
            }
            static log({type = ['unknown'], message}){
                const frame = stackTrace.get()[1];
                if(this.isValid(type)){
                    return base.lib.logger.broker.log(
                        '\x1b[2m\n', processMessage(message), '\x1b[0m', '\n',
                        `${os.hostname()} `, getLineandNumber(this.cwd, frame), ' ', '[\'', type.join('\', \''), '\']', '\n'
                    );
                }
            }

            static fatal({type = ['unknown'], message}){
                const frame = stackTrace.get()[1];
                if(this.isValid(type)){
                    base.lib.logger.broker.fatal(
                        '\x1b[31m\n', processMessage(message), '\x1b[0m', '\n',
                        getLineandNumber(this.cwd, frame), ' ', type, '\n'
                    );
                }
            }
            static error({type = ['unknown'], message}){
                const frame = stackTrace.get()[1];
                if(this.isValid(type)){
                    base.lib.logger.broker.error(
                        '\x1b[31m\n', processMessage(message), '\x1b[0m', '\n',
                        getLineandNumber(this.cwd, frame), ' ', type, '\n'
                    );
                }
            }
            static warn({type = ['unknown'], message}){
                const frame = stackTrace.get()[1];
                if(this.isValid(type)){
                    base.lib.logger.broker.warn(
                        '\x1b[33m\n', processMessage(message), '\x1b[0m', '\n',
                        getLineandNumber(this.cwd, frame), ' ', type, '\n'
                    );
                }
            }
            static info({type = ['unknown'], message}){
                const frame = stackTrace.get()[1];
                if(this.isValid(type)){
                    base.lib.logger.broker.info(
                        '\x1b[36m\n', processMessage(message), '\x1b[0m', '\n',
                        getLineandNumber(this.cwd, frame), ' ', type, '\n'
                    );
                }
            }
        }
        
        base.lib.logger = Logger
        base.lib.logger.broker = broker.createBrokerBase(base);

        return Logger;
    },
    base: {
        broker
    }
}