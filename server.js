const express = require('express')
const app = express()
const port = 8080
const cors = require("cors")
require('dotenv').config()
const { validationResult } = require('express-validator');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const { Pool } = require('pg')
global.pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_URL,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

app.get("/hello", (req, res) => {
    pool.query('SELECT NOW()', (err, resu) => {
        res.send(`hi: ${JSON.stringify(resu)}`)
        pool.end()
      })
})

/**
 * This route logs in a user and returns a json web token
 */

app.post("/user", (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})