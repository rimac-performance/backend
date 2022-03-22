const utils = require("../Utils/Utils");
const FILE_NAME = "CarService.js";
const CONSTANTS = require("../Utils/Constants");
const carDAO = require("../DAO/CarDAO")

/**
 * Creates a car and maps it to a user if the user is a car owner. OTherwise this funciton
 * maps a car to the 
 * @param {*} userID 
 * @param {*} vin 
 * @param {*} model 
 * @param {*} year 
 * @param {*} color 
 * @param {*} role 
 * @returns 
 */
function registerCar(userID, vin, model, year, color) {
    return new Promise(async (resolve, reject) => {
        // check if car exists
        const responseObj = {}
        try {
            const carExists = await carDAO.checkCarExists(vin);
            if (carExists) {
                responseObj.code = CONSTANTS.APP_ERROR_CODE.CAR_EXISTS;
                return reject(responseObj)
            }
        } catch (error) {
            console.log(`Error checking if car exists in ${FILE_NAME}: ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR
            return reject(responseObj)
        }
        // Create Car
        try {
            console.log(`Success registering car at: ${FILE_NAME}`)
            const car = await carDAO.createCar(userID, vin, model, year, color);
            return resolve(car)
        } catch (error) {
            console.log(`Error creating car in ${FILE_NAME}: ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR
            return reject(responseObj)
        }
    })
}

function mapCarToEngineer(userID, carID, role) {

}

/**
 *  This function allows a user to view cars based on their user role
 * 
 * @param {*} userID 
 * @param {*} jwtUserID 
 * @param {*} role 
 * @returns 
 */
function viewCars(userID, jwtUserID, role) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {};
        if (userID == undefined || userID == jwtUserID) {
            // ***NOTE: check if the user is an engineer
            if (role == 2) {
                try {
                    const cars = await carDAO.getCarsByUserIDForEngineer(jwtUserID);
                    return resolve(cars.rows);
                } catch (error) {
                    console.log(`Error viewing car in ${FILE_NAME}: ${error}`)
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR
                    return reject(responseObj)
                }
            }
            // Assume the user wants to view his own cars
            try {
                const cars = await carDAO.getCarsByUserID(jwtUserID);
                return resolve(cars.rows);
            } catch (error) {
                console.log(`Error viewing car in ${FILE_NAME}: ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR
                return reject(responseObj)
            }
        } else {
            // check if the user is an admin or engineer, then they can view 
            // anyone's cars
            // ****** MUST FIX
            if (role == 2 || role == 3) {
                try {
                    const cars = await carDAO.getCarsByUserID(userID);
                    return resolve(cars.rows);
                } catch (error) {
                    console.log(`Error getting car in ${FILE_NAME}: ${error}`)
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR
                    return reject(responseObj)
                }
            } else {
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED
                return reject(responseObj)
            }
        }
    })
}

function viewAllCars(role) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        if (role == 2 || role == 3) {
            try {
                const cars = await carDAO.getAllCars();
                return resolve(cars.rows)
            } catch(error) {
                console.log(`Error getting car in ${FILE_NAME}: ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR
                return reject(responseObj)
            }
        } else {
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED
                return reject(responseObj)
            }
    })
}

module.exports = {
    registerCar,
    viewCars,
    viewAllCars
}