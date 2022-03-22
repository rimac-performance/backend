const FILE_NAME = "RunService.js";
const CONSTANTS = require("../Utils/Constants");
const carDAO = require("../DAO/CarDAO");
const runDAO = require("../DAO/RunDAO");
const sensorDAO = require("../DAO/SensorDAO")
const fs = require("fs")
const csv = require("fast-csv")
const path = require("path");
const utils = require("nodemon/lib/utils");

/**
 * This function returns the run of a car as long as the request is valid
 * @returns 
 */
function viewRuns(runID, fields, role) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        // First check if car exists
        try {
            const runExists = await runDAO.checkRunExists(runID)
            if (!runExists) {
                responseObj.code = CONSTANTS.APP_ERROR_CODE.NOT_FOUND;
                return reject(responseObj)
            }
        } catch (error) {
            console.log(`Error checking if run exists at ${FILE_NAME}: ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        try {
            if (role == 1 || role == undefined) {
                const runs = await runDAO.getRunByRunID(runID, fields);
                return resolve(runs.rows)
            } else {
                const runs = await runDAO.getRunByRunIDForEngineer(runID, fields);
                return resolve(runs.rows)
            }
        } catch (error) {
            console.log(`Error getting run at ${FILE_NAME}: ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
    })
}

/**
 * This function returns all runs associated with a car for a user
 * @param {*} userID 
 * @param {*} carID 
 * @param {*} role 
 * @returns 
 */
function viewAllRuns(userID, carID, role) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {};
        if (role == 1) {
            // check if user is authorized to view runs of this car
            try {
                const carMap = await carDAO.checkCarMapsToUser(carID, userID);
                if (!carMap) {
                    console.log(`User unauthorized to view run at ${FILE_NAME}`)
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
                    return reject(responseObj)
                }
                const runs = await runDAO.getAllRunsByCarID(carID);
                return resolve(runs.rows);
            } catch (error) {
                console.log(`Error checking if car maps to user at ${FILE_NAME}: ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        } else {
            const runs = await runDAO.getAllRunsByCarID(carID);
            return resolve(runs.rows);
        }
    })
}

/**
 *  This function uploads a run from a CSV file
 * @param {*} userID 
 * @param {*} carID 
 * @param {*} runName 
 * @param {*} file 
 * @returns 
 */
function uploadRun(userID, carID, runName, file) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        // check if car
        try {
            const carMap = await carDAO.checkCarMapsToUser(carID, userID);
            if (!carMap) {
                console.log(`User unauthorized to view run at ${FILE_NAME}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
                return reject(responseObj)
            }
        } catch (error) {
            console.log(`Error checking if car maps to user at ${FILE_NAME}: ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj);
        }
        // parse file
        let fields = ''
        let rows = []
        count = 0
        fs.createReadStream(file.path)
            .pipe(csv.parse({headers: true}))
            .on('error', error =>{
                console.log(`Error checking if car maps to user at ${FILE_NAME}: ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            })
            .on('data', row => {
                if (count == 0) {
                    formattedFields = Object.keys(row);
                    for(let i = 0; i < formattedFields.length; i++) {
                        if (i == 0) {
                            formattedFields[i] = formattedFields[i]
                        } else {
                            formattedFields[i] = "'"  + formattedFields[i].split(".")[1] + "'"
                        }
                    }
                    fields = formattedFields.join()
                }
                count=1
                formattedRow=Object.values(row)
                for(let i = 0; i < formattedRow.length; i++) {
                    if(i==0){
                        formattedRow[i] = "'" + formattedRow[i].slice(0, 23).replace('T', ' ') + "'"
                    }
                    if(formattedRow[i] === '') {
                        formattedRow[i] = `NULL`
                    }
                }
                rows.push(formattedRow.join())
            })
            .on('end', async () => {
                try {
                    const run = await runDAO.createRun(carID, runName, fields, rows)
                    return resolve(run)
                } catch (error) {
                    console.log(`Couldn't insert files at ${FILE_NAME} : ${error}`)
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                    return reject(responseObj)
                }
            })
        // delete file after
        try {
            await fs.unlinkSync(file.path)
        } catch (error) {
            console.log(`Couldn't destroy file at ${FILE_NAME}`)
        }
    })
}

function emailRun(email, role, userID, runID, firstName, lastName) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        // Check if user is authorized to send run
        if (role == 1) {
            try {
                if(!(await runDAO.checkCanViewRun(userID, runID))) {
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
                    return reject(responseObj)
                }
            } catch(error) {
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        }
        // send email
        try {
            const options = {
                from: process.env.EMAIL_USER, // sender address
                to: email, // list of receivers
                subject: "You have been sent run!", // Subject line
                html: utils.sendRunTemplate(runID, firstName, lastName) , // html body
                attachments: [{
                    filename: 'Rev_Performance_Header.png',
                    path: path.resolve(__dirname, "../Utils/img/Rev_Performance_Header.png"),
                    cid: 'performanceHeader' //same cid value as in the html img src
                }]
            }
            await utils.mail(options)
        } catch (error) {
            console.log(`Error sending email at: ${FILE_NAME} ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.EMAIL;
            return reject(responseObj)
        }
        return resolve({ success: CONSTANTS.ERROR_DESC.SUCCESS })
    })
}

module.exports = {
    viewRuns,
    viewAllRuns,
    uploadRun,
    emailRun
}