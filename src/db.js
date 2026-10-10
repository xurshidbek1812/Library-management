import pg from 'pg'

const {Pool} = pg

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'library_management_test',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

export default pool