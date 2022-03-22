const pool = require("../DAO/DB");
const FILE_NAME = "adminDAO.js"

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

function getUserColumnNames() {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM public.user where = false;`
    })
}

module.exports = {
    createUser,
    deleteUser
}