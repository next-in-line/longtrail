const gadgeteer = require('../../../../index')

const app = gadgeteer.init({
    database: {
        client: 'pg',
        asyncStackTraces: true,
        // version: '7.2',
        connection: {
            database: 'gadgeteer_test'
        },
        migrations: {
            directory: './tests/migrations'
        }
    }
})

class _1Migration extends app.lib.Migration {
    async up () {
        await this.alterTable('tests13', (t)=>{
            t.string('galaxy');
        })
    }
    async down () {
        await this.alterTable('tests13', (t)=>{
            t.dropColumn('galaxy');
        })
    }
}

module.exports = _1Migration.migration()