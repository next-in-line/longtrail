const {Client} = require('pg')

module.exports = {
    describeTable: async (tableName)=>{
        const client = new Client({
            database: 'gadgeteer_test'
        })
        await client.connect()

        return (
           await client.query(`SELECT table_name, column_name, data_type FROM information_schema.COLUMNS WHERE TABLE_NAME = '${tableName}';`)
        ).rows.reduce((acc, row)=>({
           ...acc,
            [`${row.table_name}`]: {
                ...(acc[row.table_name] || {}),
                [`${row.column_name}`]: row.data_type
            }
        }), {})
    }
}