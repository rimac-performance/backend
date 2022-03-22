const FILE_NAME = "SensorService.js";
const CONSTANTS = require("../Utils/Constants");
const sensorDAO = require("../DAO/SensorDAO")

function getStatus() {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        try {
            const status = await sensorDAO.getAllStatus();
            return resolve(status.rows)
        } catch(error) {
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
    })
}

function getThreshold() {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        try {
            const threshold = await sensorDAO.getAllThreshold();
            return resolve(threshold.rows)
        } catch(error) {
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
    })
}

function updateStatus(userID, role, sensors) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        if (role != 3) {
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
            return reject(responseObj)
        }
        // Check if sensor exists and 
        for (let sensor of sensors) {
            try {
                if (await sensorDAO.checkSensorExists(sensor.name)) {
                    await sensorDAO.updateStatus(sensor.name, sensor.status, userID)
                }
            } catch (error) {
                console.log(`Error updating status of sensor at ${FILE_NAME} : ${error}`);
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        }
        return resolve({message : "Sensor status successfully updated!"})
    })
}

function updateThreshold(userID, role, sensors) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        if (role != 2) {
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
            return reject(responseObj)
        }
        for (let sensor of sensors) {
            try {
                if (await sensorDAO.checkSensorExists(sensor.name)) {
                    await sensorDAO.updateThreshold(sensor.name, sensor.threshold, userID)
                }
            } catch (error) {
                console.log(`Error updating threshold of sensor at ${FILE_NAME} : ${error}`);
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        }
        return resolve({message : "Sensor threshold successfully updated!"})
    })
}

module.exports = {
    getStatus,
    getThreshold,
    updateStatus,
    updateThreshold
}