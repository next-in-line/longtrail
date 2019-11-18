const Driver = require('./driver');
const Worker = require('./worker');
const Supervisor = require('./supervisor');
const Processor = require('./processor');



module.exports = {
    createProcessorsBase: (base)=>{
        base.lib.processors = {}
        base.lib.processors.Driver = Driver.createDriverBase(base);
        base.lib.processors.Processor = Processor.createProcessorBase(base);
        base.lib.processors.Worker = Worker.createWorkerBase(base);
        base.lib.processors.Supervisor = Supervisor.createSupervisorBase(base);
        base.lib.processors.base = {
                Driver,
                Worker,
                Supervisor,
                Processor
        }
        return base.lib.processors
    }
}