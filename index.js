const lib = require('./lib')
module.exports = {
    init: (config = {})=>{
        const base = {
            lib: {},
            config: {
                workingDirectory: process.cwd(),
                ...config,
                processors: {
                    concurrency: 1,
                    delay: 30000,
                    ...(config.processors || {})
                },
            }
        }

        base.lib = lib.createLibBase(base);
        
        return base
    }
}