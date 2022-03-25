const pool = require("../DAO/DB");
const FILE_NAME = "adminDAO.js"

/**
 * This function returns a user by their userID
 * @param {*} userID 
 * @returns 
 */
 function getUser(userID) {
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

function createUser(email, hash, phone, firstName, lastName, userRole) {
    return new Promise(async (resolve, reject) => {
        const values = [email, hash, phone, firstName, lastName, userRole];
        const query = `INSERT INTO public.user (user_id, email, pswd, phone, first_name, last_name, user_role)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6) RETURNING user_id, email, phone, first_name, last_name,
            user_role;`;
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in creating user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

function deleteUser(userID) {
    return new Promise(async (resolve, reject) => {
        const values = [userID];
        const query = `DELETE FROM public.user WHERE user_id=$1;`;
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in deleting user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

function updateUser(userID, password, email, phone, firstName, lastName, userRole) {
    return new Promise(async (resolve, reject) => {
        let values;
        let query;
        if (!password) {
            values = [userID, email, phone, firstName, lastName, userRole];
            query = `UPDATE public.user SET user_id=$1, email=$2, phone=$3, first_name=$4, last_name=$5,
            user_role=$6 WHERE public.user.user_id = $1 RETURNING user_id, email, phone, first_name, last_name, user_role`;
        } else {
            values = [userID, password, email, phone, firstName, lastName, userRole];
            query = `UPDATE public.user SET user_id=$1, pswd=$2, email=$3, phone=$4, first_name=$5, last_name=$6,
            user_role=$7 WHERE public.user.user_id = $1 RETURNING user_id, email, phone, first_name, last_name, user_role`;
        }
        try {
            return resolve(await pool.query(query, values))
        } catch (error) {
            console.log(`Error in deleting user in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

module.exports = {
    getUser,
    getAllUsers,
    createUser,
    deleteUser,
    updateUser
}