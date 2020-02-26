const _ = require('lodash');
const uuid = require('uuid');


module.exports = {
    createModelBase: (base)=>{
        const Objection = require('objection');
        const ObjectionModel = Objection.Model;
        const knex = base.lib.DB;
        ObjectionModel.knex(knex);

        // Initialize knex.
        
        const associationHelpers = require('./associationHelpers')
        
        class QueryBuilder extends ObjectionModel.QueryBuilder {
            then(cb){
                super.then((values = [])=>{
                    const a = this.modelClass()
        
                    if(Array.isArray(values)){
                        cb(
                            values.map((value)=>{
                                return new a(value)
                            })
                        )
                    }else{
                        cb(new a(values));
                    }
                })
            }
            static get db(){
        
            }
            where(...args){        
        
                return super.where(...args).skipUndefined();
            }
            async findBy(...args){
                const [item] = await this.where(...args).limit(1)
        
                return item
            }
            async findByOrCreate(...args){
                let [item] = await this.findBy(...args)
                
                if(!item){
                    item = await this.create(...args)
                }
        
                return item
            }
            async findByAndUpdateOrCreate(query, values){
                let [item] = await this.findBy(query)
                
                if(item){
                    item = await this.update(values)
        
                }else{
                    item = await this.create(values)
                }
        
                return item
            }
        }
        
        
        class Model extends ObjectionModel {
            constructor(values = {}){
                super(values)
        
                for(let key of Object.keys(values)){
                    this[key] = values[key];
                }
            }
            static get QueryBuilder () {
                return QueryBuilder;
            }
            static all(){
                return this.query();
            }
            query(){
                return super.query().skipUndefined()
            }
            static async create(options = {}){
                // options = !freezer.isImmutable(options) ? freezer(options) : options
                options.updatedAt = new Date().toISOString();
                options.createdAt = new Date().toISOString();
                options.id = uuid.v4();
                const path = [];
                if(options.path) path.push(options.path)
                path.push(options.id);
                
                options.path = path.join('.').replace(/-/g, '_');
        
                let [data] = await knex(this.tableName).returning('*').insert(options);
                data = new this(
                    data
                );
        
                return data;
            }
            static async createAssoc(options = {}){
                // options = !freezer.isImmutable(options) ? freezer(options) : options
                options.updatedAt = new Date().toISOString();
                options.createdAt = new Date().toISOString();
                const path = [];
                if(options.path) path.push(options.path)
                path.push(options.id);
                
                options.path = path.join('.').replace(/-/g, '_');
        
                let [data] = await knex(this.tableName).returning('*').insert(options);
                data = new this(
                    data
                );
        
                return data;
            }
            static where(...options){
                if(options.targetID) console.log(new Error(`${this.constructor.name}`))
                return this.query().where(...options);
            }
            static async findBy(...args){
                const [item] = await this.where(...args).limit(1)
        
                return item
            }
            async destroy(){
                await this.constructor.query().delete().where({
                    id: this.id
                });
                return true
            }
            async archive(){
                await this.constructor.query().update({archived: true}).where({
                    id: this.id
                });
        
                return true
            }
            save(){
                if(this.id){
                    return this.update(this)
                }else{
                    return this.constructor.create(this)
                }
            }
            static async findByAndUpdateOrCreate(query, values){
                const original = await this.findBy(query)
        
                if(original){
                    return await original.update(values);
                }else{
                    return await this.create(values);
                }
            }
            static async findByOrCreate(values){
                const original = await this.findBy(_.omit(values, ['email', 'mobilePhone']))
        
                if(!original){
                    return await this.create(values);
                }else{
                    return original
                }
            }
            async update(options){
                options.updatedAt = new Date().toISOString();
                if(options.path) options.path = options.path.replace(/-/g, '_')
                const [record] = await knex(this.constructor.tableName).where({id: this.id}).returning('*').update(options);
        
                return new this.constructor(record);
            }
            static async first(limit){
                if(limit){
                    return await this.query().orderBy('createdAt', 'asc').limit(limit)
                }else{
                    const [row] = await this.query().orderBy('createdAt', 'asc').limit(1)
                    return row
                }
            }
            static async last(limit){
                if(limit){
                    return await this.query().orderBy('createdAt', 'desc').limit(limit)
                }else{
                    const [row] = await this.query().orderBy('createdAt', 'desc').limit(1)
                    return row
                }
            }
            static async count(){
                const [item] = await this.query().count()
                return parseInt(item.count);
            }
            toJSON(_array){
                return super.toJSON();
            }
            belongsToCustom(modelName, handler){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
        
                const query = ()=>(
                    handler(Model.query())
                )
        
                const thener = (cb)=>{
                    
                    query().then.bind(query())(([value])=>{
                        cb(value)
                    });
                }        
                
                const catcher = (cb)=>{          
                    query().catch.bind(query())(cb);
                }
                return {
                    then: thener,
                    catch: catcher
                }
            }
            hasManyCustom(modelName, handler){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
                const key = `${_.camelCase(this.constructor.name)}ID`;
                const _Model = ()=>(
                    handler(Model.query())
                )
                
                return associationHelpers(Model, {
                    all: ()=>{
                        return _Model();
                    },
                    where: (...options)=>{
                        return _Model().where(...options);
                    }
                })
            }
            hasMany(modelName){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
                const key = `${_.camelCase(this.constructor.name)}ID`;
                
                return associationHelpers(Model, {
                    all: ()=>{
                        return Model.where(key, '=', this.id);
                    },
                    where: (...options)=>{
                        return Model.where(key, '=', this.id).where(...options);
                    },
                    create: async (options = {})=>{
                        options[key] = this.id;
                        options.path = this.path;
        
                        return await Model.create(options);
                    },
                    update: async (options)=>{
                        const item = await Model.findBy({[`${key}`]: this.id})
                        return await item.update(options);
                    },
                    destroy: async ()=>{
                        return await Model.where(key, '=', this.id).delete();
                    }
                })
            }
            hasManyThrough(joinModelName, modelName){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
                const tableName = Model.tableName;
                const JoinModel = require(`${base.config.workingDirectory}/src/models/${joinModelName}`);
                const joinTableName = JoinModel.tableName;
                
                const fromKey = `${_.camelCase(this.constructor.name)}ID`;
                const from = `${joinTableName}.${fromKey}`;
                
                const toKey = `${_.camelCase(modelName)}ID`;
                const to = `${joinTableName}.${toKey}`;
                
                return associationHelpers(Model, {
                    all: ()=>{
                        return Model.query().join(joinTableName, to, '=', `${tableName}.id`).where(from, '=', this.id);
                    },
                    where: (...options)=>{
                        return Model.query().join(joinTableName, to, '=', `${tableName}.id`).where(from, '=', this.id).andWhere(...options);
                    },
                    create: async (options = {})=>{
                        const value = await Model.create(options);
                        
                        if(value.id){
                            options = {}
                            options[fromKey] = this.id;
                            options[toKey] = value.id;
                            await JoinModel.create(options);
                        }
                        
                        return value;
                    },
                    update: async (options)=>{
                        const [item] = await Model.query().join(joinTableName, to, '=', `${tableName}.id`).where(from, '=', this.id);
                        return await item.update(options);
                    },
                    destroy: async ()=>{
                        const [item] = await Model.query().join(joinTableName, to, '=', `${tableName}.id`).where(from, '=', this.id)
                        
                        return await item.destroy();
                    }
                })
            }
            hasOne(modelName){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
                const key = `${_.camelCase(this.constructor.name)}ID`;
                const query = Model.where(key, '=', this.id).limit(1)
                
                return {
                    then: (cb)=>{
                        query.then((rows)=>{
                            cb(rows[0])
                        })
                    },
                    catch: query.catch.bind(query),
                    create: (options = {})=>{
                        options[key] = this.id;
                        options.path = this.path;
                        return Model.create(options);
                    },
                    update: async (options)=>{
                        const item = await Model.findBy({[`${key}`]: this.id})
                        return await item.update(options);
                    },
                    destroy: async ()=>{
                        const item = await Model.findBy({[`${key}`]: this.id})
                        return await item.destroy();
                    }
                };
            }
        
            hasOnePolymorphic(modelName){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
                const tableName = _.camelCase(modelName);
        
                const query = Model.query().where({
                    [`${tableName}ableID`]: this.id,
                    [`${tableName}ableType`]: this.constructor.name
                }).limit(1)
        
                return {
                    then: (cb)=>{
                        query.then((rows)=>{
                            cb(rows[0])
                        })
                    },
                    catch: query.catch.bind(query),
                    create: async (options = {})=>{
                        options.path = this.path 
                        options[`${tableName}ableID`] = this.id
                        options[`${tableName}ableType`] = this.constructor.name
        
                        return await Model.create(options);
                    },
                    update: async (options)=>{
                        const item = await Model.findBy({
                            [`${tableName}ableType`]: this.constructor.name,
                            [`${tableName}ableID`]: this.id
                        })
        
                        return await item.update(options);
                    },
                    destroy: async ()=>{
                        const item = await Model.findBy({
                            [`${tableName}ableType`]: this.constructor.name,
                            [`${tableName}ableID`]: this.id
                        })
        
                        return await item.destroy();
                    }
                }
            }
            
            belongsTo(modelName, {alias} = {}){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
                let keyName = alias || modelName 
                const key = `${_.camelCase(keyName)}ID`;
                const query = Model.where('id', '=', this[key]).limit(1);
                const thener = (cb)=>{
                    query.then.bind(query)(([value])=>{
                        cb(value)
                    });
                }        
                const catcher = (cb)=>{          
                    query.catch.bind(query)(cb);
                }
                return {
                    then: thener,
                    catch: catcher,
                    create: async (options = {})=>{
                        options.path = this.path;
                        const value = await Model.create(options);
                        
                        return await this.update({[`${this[key]}`]: value.id});
                    },
                    update: async (options)=>{
                        const item = await Model.findBy({[`${key}`]: this.id})
                        return await item.update(options);
                    },
                    destroy: async ()=>{
                        const item = await Model.findBy({[`${key}`]: this.id})
                        return await item.destroy();
                    }
                }
            }
            hasFlex(modelName){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
                const key = `${_.camelCase(this.constructor.name)}ID`;
                
                const query = Model.where(key, '=', this.id)
                const thener = (cb)=>{
                    query.then.bind(query)((datas)=>{
                        const response = {};
                        for(let data of datas){
                            if(['String', 'Number', 'Date', 'Boolean'].includes(data.type)){
                                response[data.key] = global[data.type](data.value)
                            }
                        }
                        cb(response)
                    });
                }        
                const catcher = (cb)=>{          
                    query.catch.bind(query)(cb);
                }
        
                const set = async(options)=>{
                    for(let _key of Object.keys(options)){
                        let value = options[_key]
                        let type = value.constructor.name
        
                        await Model.findByAndUpdateOrCreate({
                            [`${key}`]: this.id,
                            key: _key
        
                        }, {
                            [`${key}`]: this.id,
                            key: _key,
                            type,
                            value
                        });
                    }
        
                    return options;
                }
        
                return {
                    then: thener,
                    catch: catcher,
                    create: set,
                    update: set,
                    destroy: async ()=>{
                        const items = await Model.where({[`${key}`]: this.id})
                        for(let item of items){
                            await item.destroy();
                        }
                    }
                }
            }
            hasManyPolymorphic(modelName){
                const Model = require(`${base.config.workingDirectory}/src/models/${modelName}`);
                
                const tableName = _.camelCase(modelName);
        
                return associationHelpers(Model, {
                    all: ()=>{
                        return Model.query().where({
                            [`${tableName}ableID`]: this.id,
                            [`${tableName}ableType`]: this.constructor.name
                        });
                    },
                    where: (...options)=>{
                        return Model.query().where({
                            [`${tableName}ableID`]: this.id,
                            [`${tableName}ableType`]: this.constructor.name
                        }).where(...options);
                    },
                    create: async (options = {})=>{
                        options.path = this.path 
                        options[`${tableName}ableID`] = this.id
                        options[`${tableName}ableType`] = this.constructor.name
        
                        return await Model.create(options);
                    },
                    update: async (options)=>{
                        const item = await Model.findBy({
                            [`${tableName}ableType`]: this.constructor.name,
                            [`${tableName}ableID`]: this.id
                        })
        
                        return await item.update(options);
                    },
                    destroy: async ()=>{
                        const item = await Model.findBy({
                            [`${tableName}ableType`]: this.constructor.name,
                            [`${tableName}ableID`]: this.id
                        })
        
                        return await item.destroy();
                    }
                })
            }
            belongsToPolymorphic(whitelist = []){
                const tableName = this.tableName
                const type = `${_.camelCase(this.constructor.name)}ableType`;
                const id = `${_.camelCase(this.constructor.name)}ableID`
                if(!this[type]){
                    return false
                }
                if(this[type] && !whitelist.includes(this[type])){
                    throw `White List should be provided for polymorphic, ${this.constructor.name}, ${this[type]}`;
                }
                const Model = require(`${base.config.workingDirectory}/src/models/${this[type]}`);
                
        
                const query = Model.where({
                    id: this[id]
                }).limit(1);
        
                return {
                    then: (cb)=>{
                        query.then((row)=>{
                            const [item] = row;
                            cb(item);
                        })
                    },
                    catch: (cb)=>{
                        query.catch((errors)=>{
                            const [error] = errors;
                            cb(error);
                        })
                    },
                    create: async (options = {})=>{
                        options.path = this.path;
                        if(this[id]){
                            const modelable = await Model.create(options);
                            
                            return await this.update({
                                [`${type}`]: modelable.constructor.name,
                                [`${id}`]: modelable.id
                            });
                        }
                    },
                    update: async (options)=>{
                        if(this[id]){                    
                            const item = await Model.findBy({
                                id: this[id]
                            })
                            return await item.update(options);
                        }
                    },
                    destroy: async ()=>{
                        if(this[id]){                    
                            const item = await Model.findBy({
                                id: this[id]
                            })
                            return await item.destroy();
                        }
                    }
                };
            }
        }
        return Model;
    }
}