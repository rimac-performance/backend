// This file instantiates the db connection
const { Pool } = require('pg')

module.exports = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_URL,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

