const {longtrail} = require('../../support')
const {Client} = require('pg')
const helpers = require('./helpers')

describe('Migrations', ()=>{
    
    test('Should migrate.up()', async()=>{  
        const client = new Client({
            database: 'longtrail_test'
        })
        await client.connect()

        const app = longtrail.init({
            database: {
                client: 'pg',
                asyncStackTraces: true,
                // version: '7.2',
                connection: {
                    database: 'longtrail_test'
                },
                migrations: {
                    tableName: 'migrations1',
                    directory: './tests/suites/migrations/1'
                }
            }
        })

        await app.lib.DB.migrate.latest()

        const keys = await helpers.describeTable('tests11')
        
        
        expect(
            keys
        ).toMatchObject({
            tests11: {
                archived: 'boolean',
                createdAt: 'timestamp with time zone',
                description: 'text',
                id: 'uuid',
                name: 'character varying',
                path: 'USER-DEFINED',
                updatedAt: 'timestamp with time zone'
            }
        });
        
        
        await app.lib.DB.migrate.rollback({}, true)
    });

    test('Should migrate.down()', async()=>{  
        const client = new Client({
            database: 'longtrail_test'
        })
        
        await client.connect()

        const app = longtrail.init({
            database: {
                client: 'pg',
                asyncStackTraces: true,
                // version: '7.2',
                connection: {
                    database: 'longtrail_test'
                },
                migrations: {
                    tableName: 'migrations3',
                    directory: './tests/suites/migrations/1' // Down is a reuse of 1
                }
            }
        })

        await app.lib.DB.migrate.latest()

        const upKeys = (
            await client.query(`SELECT table_name, column_name, data_type FROM information_schema.COLUMNS WHERE TABLE_NAME = 'tests11';`)
        ).rows.reduce((acc, row)=>({
            ...acc,
            [`${row.table_name}`]: {
                ...(acc[row.table_name] || {}),
                [`${row.column_name}`]: row.data_type
            }
        }), {})
        
        expect(
            upKeys
        ).toMatchObject({
            tests11: {
                archived: 'boolean',
                createdAt: 'timestamp with time zone',
                description: 'text',
                id: 'uuid',
                name: 'character varying',
                path: 'USER-DEFINED',
                updatedAt: 'timestamp with time zone'
            }
        });

        await app.lib.DB.migrate.rollback({}, true)

        const downKeys = (
            await client.query(`SELECT table_name, column_name, data_type FROM information_schema.COLUMNS WHERE TABLE_NAME = 'tests11';`)
        ).rows[0]

        expect(
            downKeys
        ).toBeUndefined();
    });

    test('Should migrate.up() migrations.alterTable()', async()=>{  
        const client = new Client({
            database: 'longtrail_test'
        })
        
        await client.connect()

        const app = longtrail.init({
            database: {
                client: 'pg',
                asyncStackTraces: true,
                // version: '7.2',
                connection: {
                    database: 'longtrail_test'
                },
                migrations: {
                    tableName: 'migrations4',
                    directory: './tests/suites/migrations/3'
                }
            }
        })

        await app.lib.DB.migrate.latest()

        const upKeys = await helpers.describeTable('tests13')
       
        
        await app.lib.DB.migrate.rollback({}, true)
        expect(
            upKeys
        ).toMatchObject({
            tests13: {
                archived: 'boolean',
                createdAt: 'timestamp with time zone',
                description: 'text',
                id: 'uuid',
                galaxy: 'character varying',
                name: 'character varying',
                path: 'USER-DEFINED',
                updatedAt: 'timestamp with time zone'
            }
        });
    });

    test('Should migrate.up() migrations.createTable() SAFE', async()=>{  
        const client = new Client({
            database: 'longtrail_test'
        })
        
        await client.connect()

        const app = longtrail.init({
            database: {
                client: 'pg',
                asyncStackTraces: true,
                // version: '7.2',
                connection: {
                    database: 'longtrail_test'
                },
                migrations: {
                    tableName: 'migrations4',
                    directory: './tests/suites/migrations/4'
                }
            }
        })

        await app.lib.DB.migrate.latest()

        const upKeys = (
            await client.query(`SELECT table_name, column_name, data_type FROM information_schema.COLUMNS WHERE TABLE_NAME = 'tests14';`)
        ).rows.reduce((acc, row)=>({
            ...acc,
            [`${row.table_name}`]: {
                ...(acc[row.table_name] || {}),
                [`${row.column_name}`]: row.data_type
            }
        }), {})
        
        expect(
            upKeys
        ).toMatchObject({
        });
       
        
        const downKeys = await helpers.describeTable('tests14')
        
        await app.lib.DB.migrate.rollback({}, true)

        expect(
            downKeys
        ).toMatchObject({
            tests14: {
                archived: 'boolean',
                createdAt: 'timestamp with time zone',
                updatedAt: 'timestamp with time zone',
                description: 'text',
                id: 'uuid',
                name: 'character varying',
                path: 'USER-DEFINED'
            }
        });
    });

    test('Should migrate.up() migrations.addColumn()', async()=>{  
        const client = new Client({
            database: 'longtrail_test'
        })
        
        await client.connect()

        const app = longtrail.init({
            database: {
                client: 'pg',
                asyncStackTraces: true,
                // version: '7.2',
                connection: {
                    database: 'longtrail_test'
                },
                migrations: {
                    tableName: 'migrations5',
                    directory: './tests/suites/migrations/5'
                }
            }
        })

        await app.lib.DB.migrate.latest()

        const upKeys = (
            await client.query(`SELECT table_name, column_name, data_type FROM information_schema.COLUMNS WHERE TABLE_NAME = 'tests15';`)
        ).rows.reduce((acc, row)=>({
            ...acc,
            [`${row.table_name}`]: {
                ...(acc[row.table_name] || {}),
                [`${row.column_name}`]: row.data_type
            }
        }), {})
        
        expect(
            await client.query(`select * from mocks where name='5_2Migration.js(index)'`)
        ).toMatchObject({
            rows: {}
        });
       
        
        await app.lib.DB.migrate.rollback({}, true)

        const result = await client.query(`select * from mocks where name='5_2Migration.js(index)'`)
        await client.query(`delete from mocks where name='5_2Migration.js(index)'`)
        
        expect(
            result.rows[0]
        ).toMatchObject({
          path: null,
          archived: false,
          createdAt: null,
          updatedAt: null,
          name: '5_2Migration.js(index)',
          value: 'DROP INDEX "tests15_all"'
        });

    });
})