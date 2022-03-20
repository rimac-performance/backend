const pool = require("../DAO/DB");
const FILE_NAME = "SensorDAO.js"

function getAllStatus() {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT name, status FROM sensors;';
        try {
            return resolve(await pool.query(query))
        } catch (error) {
            console.log(`Error getting status at ${FILE_NAME} : ${error}`);
            return reject(error);
        }
    })
}

function getAllThreshold() {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT name, threshold FROM sensors;';
        try {
            return resolve(await pool.query(query))
        } catch (error) {
            console.log(`Error getting threshold at ${FILE_NAME} : ${error}`);
            return reject(error);
        }
    })
}

function updateStatus(sensorName, status, userID) {
    return new Promise(async (resolve, reject) => {
        const values = [sensorName, status, userID];
        const query = 'UPDATE public.sensors SET status = $2, status_agent = $3 WHERE name = $1;';
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error updating status at ${FILE_NAME} : ${error}`);
            return reject(error);
        }
    })
}

function checkSensorExists(sensorName) {
    return new Promise(async (resolve, reject) => {
        const values = [sensorName];
        const query = 'SELECT * FROM public.sensors WHERE name=$1;';
        try {
            const sensor = await pool.query(query, values);
            if (sensor.rows.length == 0) {
                return resolve(false)
            } else {
                return resolve(true)
            }
        } catch (error) {
            console.log(`Error checking if sensor exists at ${FILE_NAME}: ${error}`)
            return reject(error)
        }
    })
}

function checkSensorStatus(sensorName) {
    return new Promise(async (resolve, reject) => {
        const values = [sensorName];
        const query = 'SELECT * FROM public.sensors WHERE name=$1 and status=1;';
        try {
            const sensor = await pool.query(query, values);
            if (sensor.rows.length == 0) {
                return resolve(false)
            } else {
                return resolve(true)
            }
        } catch (error) {
            console.log(`Error checking if sensor exists at ${FILE_NAME}: ${error}`)
            return reject(error)
        }
    })
}

function updateThreshold(sensorName, threshold, userID) {
    return new Promise(async (resolve, reject) => {
        const values = [sensorName, threshold, userID];
        const query = 'UPDATE public.sensors SET threshold = $2, threshold_agent = $3 WHERE name = $1;';
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error updating status at ${FILE_NAME} : ${error}`);
            return reject(error);
        }
    })
}

function getValidSensors() {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT name FROM sensors WHERE status=1;';
        try {
            const sensors = await pool.query(query);
            return resolve(sensors.rows)
        } catch (error) {
            console.log(`Error getting valid status' at ${FILE_NAME} : ${error}`);
            return reject(error);
        }
    })
}

function getAllSensors() {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT name FROM sensors;';
        try {
            const sensors = await pool.query(query);
            return resolve(sensors.rows)
        } catch (error) {
            console.log(`Error getting all status' at ${FILE_NAME} : ${error}`);
            return reject(error);
        }
    })
}

module.exports = {
    getAllStatus,
    getAllThreshold,
    updateStatus,
    checkSensorExists,
    checkSensorStatus,
    updateThreshold,
    getValidSensors,
    getAllSensors
}