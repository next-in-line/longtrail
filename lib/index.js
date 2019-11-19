const logger = require('./logger')
const model = require('./model')
const db = require('./db')
const store = require('./store')
const processors = require('./processors')
const redis = require('./redis')
const router = require('./router')
const migration = require('./migration')
const controller = require('./controller')
const messenger = require('./messenger')


module.exports = {
    createLibBase: (base)=>{
        base.lib = {};
        base.lib.logger = logger.createLoggerBase(base);
        base.lib.DB = db.createDBBase(base);
        base.lib.redis = redis.createRedisBase(base);
        base.lib.processors = processors.createProcessorsBase(base);
        base.lib.Model = model.createModelBase(base);
        base.lib.Store = store.createStoreBase(base);
        base.lib.router = router.createRouterBase(base);
        base.lib.Migration = migration.createMigrationBase(base);
        base.lib.Controller = controller.createControllerBase(base);
        base.lib.Messenger = messenger.createMessengerBase(base);
        return base.lib
    },
    logger,
    model,
    db,
    store,
    processors,
    redis,
    router,
    migration,
    controller
}