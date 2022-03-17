const pool = require("../DAO/DB");
const FILE_NAME = "RunDAO.js"
const CONSTANTS = require("../Utils/Constants")
const sensorDAO = require("../DAO/SensorDAO")

/**
 *  This function returns run data by the car_id
 * @returns 
 */
function getRunByRunID(runID, fields) {
    return new Promise(async (resolve, reject) => {
        let values = [runID];
        let validSensors=[];
        try {
            const sensors = await sensorDAO.getValidSensors();
            for (let sensor of sensors) {
                validSensors.push(sensor.name)
            }
        } catch (error) {
            console.log(`Error getting valid sensors at ${FILE_NAME} : ${error}`)
            return reject(error)
        }
        const queryFirst = `SELECT time, `;
        const queryLast = ` FROM rundata_raw WHERE run_id=$1;`
        let keys= ""
        i=0
        while (i < fields.length) {
            if(validSensors.includes(fields[i])){
                if (i == fields.length - 1){
                    keys += "\""  + fields[i] + "\""
                } else {
                    keys += "\"" + fields[i] + "\", "
                }
            }
            i++
        }
        let query;
        if (keys.length == 0) {
            query = "SELECT FROM rundata_raw WHERE 1=0;"
            values=[]
        }else{
            query = queryFirst + keys + queryLast; 
        }
        try {
            return resolve(await pool.query(query, values));
        } catch(error) {
            console.log(`Error in getting run id at ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 *  This function returns run data by the car_id
 * @returns 
 */
 function getRunByRunIDForEngineer(runID, fields) {
    return new Promise(async (resolve, reject) => {
        let values = [runID];
        let validSensors=[];
        try {
            const sensors = await sensorDAO.getAllSensors();
            for (let sensor of sensors) {
                validSensors.push(sensor.name)
            }
        } catch (error) {
            console.log(`Error getting valid sensors at ${FILE_NAME} : ${error}`)
            return reject(error)
        }
        const queryFirst = `SELECT time, `;
        const queryLast = ` FROM rundata_raw WHERE run_id=$1;`
        let keys= ""
        i=0
        while (i < fields.length) {
            if(validSensors.includes(fields[i])){
                if (i == fields.length - 1){
                    keys += "\""  + fields[i] + "\""
                } else {
                    keys += "\"" + fields[i] + "\", "
                }
            }
            i++
        }
        let query;
        if (keys.length == 0) {
            query = "SELECT FROM rundata_raw WHERE 1=0;"
            values=[]
        }else{
            query = queryFirst + keys + queryLast; 
        }
        try {
            return resolve(await pool.query(query, values));
        } catch(error) {
            console.log(`Error in getting run id at ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * View All runs associated with car
 */
function getAllRunsByCarID(carID){
    return new Promise(async (resolve, reject) => {
        const values = [carID]
        const query = `SELECT * FROM run WHERE car_id = $1;`
        try {
            return resolve(await pool.query(query, values));
        } catch(error) {
            console.log(`Error in checking car exists ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * This function checks if a run exists in the db
 * @param {*} runID 
 * @returns 
 */
function checkRunExists(runID) {
    return new Promise(async (resolve, reject) => {
        const values=[runID]
        const query=`SELECT * FROM run where run_id=$1;`
        try {
            const run = await pool.query(query, values);
            if (run.rows == 0) {
                return resolve(false);
            } else {
                return resolve(true)
            }
        } catch(error) {
            console.log(`Error in checking run exists ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

function checkCanViewRun(userID, runID) {
    return new Promise(async (resolve, reject) => {
        const values=[userID, runID]
        const query=`SELECT public.user.user_id, run.run_id FROM public.user JOIN car_has_owner 
            ON public.user.user_id = car_has_owner.user_id JOIN run ON car_has_owner.car_id = run.car_id
            WHERE public.user.user_id = $1 and run.run_id = $2;`
        try {
            const run = await pool.query(query, values);
            if (run.rows.length == 0) {
                return resolve(false);
            } else {
                return resolve(true)
            }
        } catch(error) {
            console.log(`Error in checking run exists ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

function createRun(carID, runName, fields, rows) {
    return new Promise(async (resolve, reject) => {
        try {
            await pool.query("BEGIN")
            let values = [carID, runName];
            let query = `INSERT INTO public.run (run_id, car_id, name, run_date)
            VALUES (gen_random_uuid(), $1, $2, NOW()) RETURNING run_id, car_id, name, run_date;`;
            let run = await pool.query(query, values)
            query = `INSERT INTO public.rundata_raw VALUES `;
            if (rows.length != 0) {
                i=0
                for (const row of rows) {
                    if (i == rows.length - 1) {
                        query += `('${run.rows[0].run_id}', ${row});`;
                    } else {
                        query += `('${run.rows[0].run_id}', ${row}), `;
                    }
                    i++
                }
                await pool.query(query)
                await pool.query("COMMIT")
            }
            return resolve(run.rows[0])
        } catch(error) {
            await pool.query("ROLLBACK")
            console.log(`Error in creating run at ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

module.exports = {
    getRunByRunID,
    getRunByRunIDForEngineer,
    getAllRunsByCarID,
    checkRunExists,
    checkCanViewRun,
    createRun
}