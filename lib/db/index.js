const Knex = require('knex');
module.exports = {
    createDBBase(base){
        const knex = Knex({
            ...base.config.database,
            asyncStackTraces: true
        })
        return knex; 
    }
}
