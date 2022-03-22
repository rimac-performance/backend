const userDAO = require("../DAO/UserDAO");
const utils = require("../Utils/Utils");
const FILE_NAME = "UserService.js";
const CONSTANTS = require("../Utils/Constants");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const shortid = require("shortid")
const path = require("path")

/**
 * This function checks to see if a user exists given an email and password
 * then returns a JWT Token if it does.
 * 
 * @param {*} email The user's email
 * @param {*} password The user's password
 * @returns 
 */
function login(email, password) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {};
        let user;
        try {
            user = await userDAO.getUser(email);
        } catch (err) {
            console.log(`Error in getting user at: ${FILE_NAME}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR
            return reject(responseObj)
        }
        if (user.rows.length == 0) {
            console.log(`User not found at: ${FILE_NAME}`);
            responseObj.code = CONSTANTS.APP_ERROR_CODE.NOT_FOUND;
            return reject(responseObj);
        } else {
            try {
                const samePassword = await bcrypt.compare(password, user.rows[0].pswd)
                if (samePassword) {
                    console.log(`Success in login at: ${FILE_NAME}`)
                    user = user.rows[0]
                    return resolve({
                        token: utils.generateJWT(user.user_id, user.email, user.phone,
                            user.first_name, user.last_name, user.user_role)
                    });
                } else {
                    console.log(`Incrorrect email or password in login at: ${FILE_NAME}`);
                    responseObj.code = CONSTANTS.APP_ERROR_CODE.INVALID_EMAIL_OR_PASSWORD
                    return reject(responseObj)
                }
            } catch (error) {
                console.log(`Error in getting user at: ${FILE_NAME}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR
                return reject(responseObj)
            }

        }
    })
}

/**
 * This function creates a user in the db as a car owner
 * 
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} password 
 * @param {*} phone 
 * @param {*} email 
 * @returns 
 */
function register(firstName, lastName, password, phone, email) {
    return new Promise(async (resolve, reject) => {
        // check if user exists
        responseObj = {}
        let user;
        let newUser;
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
            newUser = await userDAO.createUser(email, hash, phone, firstName, lastName);
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
    });
}

/**
 * This function will send a reset link to the user's email.
 * 
 * @param {*} email 
 * @returns 
 */
function forgot(email) {
    return new Promise(async (resolve, reject) => {
        responseObj = {}
        let user;
        let resetCode;
        // Check if user exists
        try {
            user = await userDAO.checkUserExists(email);
            if (!user) {
                console.log(`User doesn't exist at: ${FILE_NAME}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.NOT_FOUND;
                return reject(responseObj)
            }
        } catch (error) {
            console.log(`Error checking user at: ${FILE_NAME} ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        // create code and save in the db
        try {
            resetCode = shortid.generate();
            await userDAO.updateResetPassword(resetCode, email)
        } catch(error) {
            console.log(`Error setting reset code at: ${FILE_NAME} ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        // send email
        try {
            const options = {
                from: process.env.EMAIL_USER, // sender address
                to: email, // list of receivers
                subject: "Reset Password", // Subject line
                html: utils.forgotEmailTemplate(resetCode), // html body
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

function resetPassword(email, password, resetCode) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {}
        try {
            const userExists = await userDAO.checkUserExists(email);
            if(!userExists) {
                responseObj.code = CONSTANTS.APP_ERROR_CODE.NOT_FOUND;
                return reject(responseObj)
            }
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            await userDAO.resetPassword(email, resetCode, hash)
            return resolve({message: "success"})
        } catch(error) {
            console.log(`Error resetting password at ${FILE_NAME} : ${error}`)
            responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj);
        }
    })
}

/**
 * This will return a list of users if the user is an engineer/admin,
 * or return the user if the user is a car owner
 * 
 * @param {*} userID 
 * @param {*} role 
 * @returns 
 */
function viewUsers(userID, role) {
    return new Promise(async (resolve, reject) => {
        const responseObj = {};
        // if user is car owner only return them
        if (role == 1) {
            try {
                const user = await userDAO.getUserByUserID(userID)
                return resolve(user.rows)
            } catch (error) {
                console.log(`Error viewing user at: ${FILE_NAME} ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        } else {
            try {
                const users = await userDAO.getAllUsers();
                return resolve(users.rows);
            } catch (error) {
                console.log(`Error viewing users at: ${FILE_NAME} ${error}`)
                responseObj.code = CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
                return reject(responseObj)
            }
        }
    })
}

function testInsert(password) {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            await userDAO.testInsert(hash)
            return resolve({success: "success"})
        } catch(error) {
            return reject(error)
        }
    })
}

module.exports = {
    login,
    register,
    forgot,
    resetPassword,
    viewUsers,
    testInsert
}