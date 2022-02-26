const pool = require("../DAO/DB");
const FILE_NAME = "CarDAO.js"

function createCar(userID, vin, model, year, color) {
    return new Promise(async (resolve, reject) => {
        try {
            await pool.query("BEGIN")
            let values = [vin, model, year, color];
            let query = `INSERT INTO public.car (car_id, vin, model, year, color)
            VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING car_id, vin, model, year, color;`;
            let car = await pool.query(query, values)
            values = [userID]
            query = `INSERT INTO public.car_has_owner (car_id, user_id) VALUES ('${car.rows[0].car_id}', $1) RETURNING car_id;`
            await pool.query(query, values)
            await pool.query("COMMIT")
            return resolve(car.rows[0])
        } catch (error) {
            console.log(`Error in creating car in ${FILE_NAME}: ${error}`)
            await pool.query("ROLLBACK")
            return reject(error);
        }
    })
}

/**
 * This function maps a car to an engineer
 * @param {*} userID 
 * @param {*} carID 
 * @returns 
 */
function createCarForEngineer(userID, carID) {
    return new Promise(async (resolve, reject) => {
        try {
            const values = [userID, carID]
            const query = `INSERT INTO public.car_has_engineer (car_id, user_id) VALUES ($1, $2) RETURNING car_id, user_id;`
            const result = await pool.query(query, values)
            return resolve(result.rows[0])
        } catch (error) {
            console.log(`Error in creating car in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * This function checks to see if a car exists by the vin numer
 * @param {*} vin 
 * @returns 
 */
function checkCarExists(vin) {
    return new Promise(async (resolve, reject) => {
        const values = [vin];
        const query = `SELECT * FROM public.car WHERE vin=$1;`;
        try {
            const car = await pool.query(query, values);
            if (car.rows.length == 0) {
                return resolve(false)
            } else {
                return resolve(true)
            }
        } catch (error) {
            console.log(`Error in checking car exists ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * This function checks to see if a car exists by the car_id
 * @param {*} vin 
 * @returns 
 */
function checkCarExistsByCarID(carID) {
    return new Promise(async (resolve, reject) => {
        const values = [carID];
        const query = `SELECT * FROM public.car WHERE car_id=$1;`;
        try {
            const car = await pool.query(query, values);
            if (car.rows.length == 0) {
                return resolve(false)
            } else {
                return resolve(true)
            }
        } catch (error) {
            console.log(`Error in checking car exists ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * This function returns a list of cars by a userID
 * @param {*} userID 
 * @returns 
 */
function getCarsByUserID(userID) {
    return new Promise(async (resolve, reject) => {
        const values = [userID];
        const query = `SELECT car.* FROM car JOIN car_has_owner on car.user_id = car_has_owner.user_id WHERE 
            car_has_owner.user_id=$1`;
        try {
            return resolve(await pool.query(query, values));
        } catch (error) {
            console.log(`Error in checking car exists ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    });
}

/**
 * This function returns a list of cars by a userID
 * @param {*} userID 
 * @returns 
 */
 function getCarsByUserIDForEngineer(userID) {
    return new Promise(async (resolve, reject) => {
        const values = [userID];
        const query = `SELECT car.* FROM car JOIN car_has_engineer on car.user_id = car_has_engineer.user_id WHERE 
            car_has_engineer.user_id=$1`;
        try {
            return resolve(await pool.query(query, values));
        } catch (error) {
            console.log(`Error in checking car exists ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    });
}

/**
 * This function checks if a car and a user exists
 * @param {*} carID 
 * @param {*} userID 
 * @returns 
 */
function checkCarMapsToUser(carID, userID) {
    return new Promise(async (resolve, reject) => {
        const values = [carID, userID];
        const query = `SELECT * FROM car_has_owner WHERE car_id=$1 AND user_id=$2;`; 
        try {
            const map = await pool.query(query, values);
            if (map.rows.length == 0) {
                return resolve(false)
            } else {
                return resolve(true)
            }
        } catch(error) {
            console.log(`Error in checking car exists ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

module.exports = {
    createCar,
    checkCarExists,
    checkCarExistsByCarID,
    createCar,
    getCarsByUserID,
    getCarsByUserIDForEngineer,
    checkCarMapsToUser
}