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
            console.log(`Error in creating user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * This function checks if an email exists in the db
 * @param {*} email 
 * @returns 
 */
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
            console.log(`Error in checking user exists in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * This function updates the password 
 * @param {*} resetCode 
 * @param {*} email 
 * @returns 
 */
function updateResetPassword(resetCode, email) {
    return new Promise(async (resolve, reject) => {
        const values = [resetCode, email];
        const query = `UPDATE public.user SET pswd_reset = $1 WHERE email = $2;`;
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in updating user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    });
}

function resetPassword(email, resetCode, password) {
    return new Promise(async (resolve, reject) => {
        const values = [email, resetCode, password];
        const query = `UPDATE public.user SET pswd= $3, pswd_reset = '' WHERE email = $1 and pswd_reset = $2;`;
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in resetting password at ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * This function returns all of the users in the user table
 * @returns 
 */
function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT user_id, email, phone, first_name, last_name, user_role FROM public.user;'
        try {
            return resolve(await pool.query(query))
        } catch (error) {
            console.log(`Error in getting all users in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

/**
 * This function returns a user by their userID
 * @param {*} userID 
 * @returns 
 */
function getUserByUserID(userID) {
    return new Promise(async (resolve, reject) => {
        const values = [userID];
        const query = `SELECT user_id, email, phone, first_name, last_name, user_role FROM public.user WHERE user_id=$1;`;
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in getting user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

function testInsert(hash) {
    return new Promise(async (resolve, reject ) => {
        const values = [hash];
        const query = `UPDATE public.user SET pswd=$1 where email='ghuckin0@yahoo.co.jp';`
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in getting user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

module.exports = {
    getUser,
    createUser,
    checkUserExists,
    updateResetPassword,
    resetPassword,
    getAllUsers,
    getUserByUserID,
    testInsert
}