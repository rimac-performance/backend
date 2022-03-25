const utils = require("../Utils/Utils");
const FILE_NAME = "AdminService.js";
const CONSTANTS = require("../Utils/Constants");
const adminDAO = require("../DAO/AdminDAO")
const userDAO = require("../DAO/UserDAO")
const bcrypt = require('bcrypt');
const saltRounds = 10;

function insertUser(password, email, phone, firstName, lastName, userRole, adminRole) {
    return new Promise(async (resolve, reject) => {
        responseObj = {}
        let user;
        let newUser;
        // check if user is an admin
        if (adminRole != 3) {
            console.log(`Error user is not authorized to create user at: ${FILE_NAME}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
            return reject(responseObj)
        }
        // Check if user exists
        try {
            user = await userDAO.checkUserExists(email);
            if (user) {
                console.log(`Error user already exists at: ${FILE_NAME}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.USER_EXISTS;
                return reject(responseObj)
            }
        } catch (error) {
            console.log(`Error checking user at: ${FILE_NAME} ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        // Create User
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            newUser = await adminDAO.createUser(email, hash, phone, firstName, lastName, userRole);
        } catch (error) {
            console.log(`Error creating user at: ${FILE_NAME} ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        newUser = newUser.rows[0];
        return resolve({
            token: utils.generateJWT(newUser.user_id, newUser.email, newUser.phone,
                newUser.first_name, newUser.last_name, newUser.user_role)
        });
    })
}

function getUser(userID, adminRole) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        if (adminRole == 2 || adminRole == 3) {
            try{
                const user = await adminDAO.getUser(userID)
                if(user.rows.length == 0) {
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.NOT_FOUND
                    return reject(responseObj)
                }else {
                    return resolve(user.rows[0])
                }
            } catch(error) {
                console.log(`Error viewing user at: ${FILE_NAME} ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        } else {
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
            return reject(responseObj)
        }
    })
}

function getAllUsers(adminRole) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        if (adminRole == 2 || adminRole == 3) {
            try {
                const users = await adminDAO.getAllUsers();
                return resolve(users.rows)
            } catch(error) {
                console.log(`Error viewing all users at: ${FILE_NAME} ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        } else {
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
            return reject(responseObj)
        }
    })
}

function updateUser(userID, password, email, phone, firstName, lastName, userRole, adminRole) {
    return new Promise(async (resolve, reject) => {
        responseObj = {}
        let user;
        let newUser;
        // check if user is an admin
        if (adminRole != 3) {
            console.log(`Error user is not authorized to update user at: ${FILE_NAME}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
            return reject(responseObj)
        }
        // Check if user exists
        try {
            user = await userDAO.checkUserExistsByUserID(userID);
            if (!user) {
                console.log(`Error user not found at: ${FILE_NAME}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.NOT_FOUND;
                return reject(responseObj)
            }
        } catch (error) {
            console.log(`Error checking user at: ${FILE_NAME} ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        // Create User
        try {
            if (password) {
                const salt = await bcrypt.genSalt(saltRounds);
                password = await bcrypt.hash(password, salt);
            }
            newUser = await adminDAO.updateUser(userID, password, email, phone, firstName, lastName, userRole);
        } catch (error) {
            console.log(`Error updating user at: ${FILE_NAME} ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        newUser = newUser.rows[0];
        return resolve(newUser);
    })
}

function deleteUser(userID, adminRole) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        if (adminRole != 3) {
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED;
            return reject(responseObj)
        }
        try {
            const deletedUser = await adminDAO.deleteUser(userID);
            if (deletedUser.rowCount == 0) {
                responseObj.code = CONSTANTS.APP_ERROR_CODE.NOT_FOUND
                return reject(responseObj)
            }
            return resolve({message: CONSTANTS.ERROR_DESC.SUCCESS})
        } catch(error) {
            console.log(`Error deleting user at: ${FILE_NAME} ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
    })
}

module.exports = {
    insertUser,
    getUser,
    getAllUsers,
    deleteUser,
    updateUser
}