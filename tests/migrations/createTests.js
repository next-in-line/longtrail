const longtrail = require('../../index')

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
        await this.createTable('tests', (t)=>{
            t.string('name')
            t.text('description')
        })
        await this.createTable('mocks', (t)=>{
            t.string('name')
            t.text('value')
        })
    }
    async down () {
        await this.dropTable('tests')   
        await this.dropTable('mocks')
    }
}
module.exports = createTests.migration()