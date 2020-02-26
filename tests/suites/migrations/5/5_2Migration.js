const longtrail = require('../../../../index')
const {v4} = require('uuid')
const app = longtrail.init({
    database: {
        client: 'pg',
        asyncStackTraces: true,
        // version: '7.2',
        connection: {
            database: 'longtrail_test'
        },
        migrations: {
            directory: './tests/migrations'
        }
    }
})

class createTests extends app.lib.Migration {
    async up () {
        await this.addColumn('tests15', 'food', 'string')
        await this.addColumn('tests15', 'myFood', 'varchar(400)')
        await this.addColumn('tests15', 'myFoodIs', 'string', 'hello')
        await this.addIndex('tests15', 'all', ['food', 'myFood', 'myFoodIs'], ['btree'])
    }
    async down () {
        await this.dropColumn('tests15', 'food')
        await this.dropColumn('tests15', 'myFood')
        await this.dropColumn('tests15', 'myFoodIs')
        
        // Has to be mocked due to timing
        this.knex._raw = this.knex.raw
        this.knex.raw = (args)=>(
            this.knex._raw(`insert into mocks (id, "name", "value") values ('${v4()}','5_2Migration.js(index)', '${args}')`)
        )
        await this.dropIndex('tests15', 'all')
        this.knex.raw = this.knex._raw
    }
}

module.exports = createTests.migration()