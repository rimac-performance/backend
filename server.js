const express = require('express')
const app = express()
const port = 8080
const cors = require("cors")
require('dotenv').config()
const { validationResult } = require('express-validator');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/hello", (req, res) => {
    res.send("hi: " + process.env);
})

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
    console.log(process.env.db_username)
})