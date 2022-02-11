const pool = require("../DAO/DB");
const FILE_NAME = "userDAO.js"

/**
 * 
 *  This function queries the database for a user
 *  given an email and password.
 * 
 * @param {*} email A user's email
 * @param {*} password A user's password
 * @returns 
 */
function getUser(email) {
    return new Promise(async (resolve, reject) => {
        const values = [email];
        const query = 'SELECT * FROM public.user WHERE email=$1;';
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in getting user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 *  This function creates a user(car owner) in the database
 * @param {*} email 
 * @param {*} password 
 * @param {*} phone 
 * @param {*} firstName 
 * @param {*} lastName 
 * @returns 
 */
function createUser(email, password, phone, firstName, lastName) {
    return new Promise(async (resolve, reject) => {
        const values = [email, password, phone, firstName, lastName];
        const query = `INSERT INTO public.user (user_id, email, pswd, phone, first_name, last_name, user_role)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 1) RETURNING user_id, email, phone, first_name, last_name,
            user_role;`;
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in getting user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

function checkUserExists(email) {
    return new Promise(async (resolve, reject) => {
        const values = [email];
        const query = `SELECT * FROM public.user WHERE email=$1`;
        try {
            const user = await pool.query(query, values);
            if (user.rows.length == 0) {
                return resolve(false)
            } else {
                return resolve(true)
            }
        } catch (error) {
            console.log(`Error in getting user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}


module.exports = {
    getUser,
    createUser,
    checkUserExists
}