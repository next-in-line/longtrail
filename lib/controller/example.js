const {ExampleModelName} = require('src/models')
const strongParams = require('src/params')
const logger = require('lib/logger');

const Controller = require('lib/controller')

class ExampleName extends Controller {
    async before(){
        return await super.before()
    }
    async index(){
        return this.render({
            json: await ExampleModelName.all()
        });
    }

    async show(){
        return this.render({
            json: await ExampleModelName.findBy({id: this.params.id})
        });
    }
     
    async create(){
        return this.render({
            json: await ExampleModelName.create({id: this.params})
        });
    }   

    async update(){
        const exampleNameItem = await ExampleModelName.findBy({id: this.params.id})
        return this.render({
            json: await exampleNameItem.update(this.params)
        });
    }

    async destroy(){
        const exampleNameItem = await ExampleModelName.findBy({id: this.params.id})
        try{
            await exampleNameItem.destroy()
        }catch(error){
            return this.render({
                body: error,
                status: 400
            }) 
        }

        return this.render({
            status: 200,
            nothing: false
        })
    }
}

module.exports = ExampleName