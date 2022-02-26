const utils = require("../Utils/Utils");
const FILE_NAME = "RunService.js";
const CONSTANTS = require("../Utils/Constants");
const carDAO = require("../DAO/CarDAO");
const runDAO = require("../DAO/RunDAO");

/**
 * This function returns the run of a car as long as the request is valid
 * @returns 
 */
function viewRuns(jwtUserID, role, runID, fields) {
    return new Promise(async(resolve, reject) => {
        const responseObj={}
        // First check if car exists
        try {
            const runExists = await runDAO.checkRunExists(runID)
            if(!runExists) {
                responseObj.code = CONSTANTS.APP_ERROR_CODE.NOT_FOUND;
                return reject(responseObj)
            }
        } catch (error) {
            console.log(`Error checking if run exists at ${FILE_NAME}: ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        // Check if user is authorized to view run
        if (role == 2 || role == 3) {
            try {
                const runs = await runDAO.getRunByRunID(runID, fields);
                return resolve(runs.rows)
            } catch(error) {
                console.log(`Error getting run at ${FILE_NAME}: ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        } else {
            // Check if the car owner is allowed to view the run
            try {
                if (!await runDAO.checkCanViewRun(jwtUserID, runID)) {
                    console.log(`User unauthorized to view run at ${FILE_NAME}: ${error}`)
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
                    return reject(responseObj)
                }
            } catch(error) {
                console.log(`Error checking if the user is authorized to view run at ${FILE_NAME}: ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
            try {
                const runs = await runDAO.getRunByRunID(runID, fields);
                return resolve(runs.rows)
            } catch(error) {
                console.log(`Error getting run at ${FILE_NAME}: ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        }
    })
}

function viewAllRuns(userID, carID, role) {
    return new Promise(async (resolve, reject) => {
        const responseObj={};
        if (role == 1) {
            // check if user is authorized to view runs of this car
            try {
                const carMap = await carDAO.checkCarMapsToUser(carID, userID);
                console.log(carID, userID)
                if (!carMap) {
                    console.log(`User unauthorized to view run at ${FILE_NAME}`)
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
                    return reject(responseObj)
                }
                const runs = await runDAO.getAllRunsByCarID(carID);
                return resolve(runs.rows);
            } catch(error) {
                console.log(`Error checking if car mapss to user at ${FILE_NAME}: ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        } else {
            const runs = await runDAO.getAllRunsByCarID(carID);
            return resolve(runs.rows);
        }
    })
}

module.exports = {
    viewRuns,
    viewAllRuns
}