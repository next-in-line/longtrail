const longtrail = require('../../../../index')

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
        await this.createTable('tests11', (t)=>{
            t.string('name')
            t.text('description')
        })
    }
    async down () {
        await this.dropTable('tests11')   
    }
}

module.exports = createTests.migration()