const userDAO = require("../DAO/UserDAO");
const utils = require("../Utils/Utils");
const FILE_NAME = "UserService.js";
const CONSTANTS = require("../Utils/Constants");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            user = await userDAO.getUser(email, hash);
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
            console.log(`Success in login at: ${FILE_NAME}`)
            return resolve(user.rows[0]);
        }
    })
}

function register(firstName, lastName, password, phone, email) {
    return new Promise(async (resolve, reject) => {
        // check if user exists
        responseObj={}
        let user;
        let newUser;
        // Check if user exists
        try {
            user = await userDAO.checkUserExists(email);
            if (user) {
                console.log(`Error user already exists at: ${FILE_NAME}`)
                responseObj.code=CONSTANTS.APP_ERROR_CODE.USER_EXISTS;
                return reject(responseObj)
            }
        } catch (error) {
            console.log(`Error checking user at: ${FILE_NAME} ${error}`)
            responseObj.code=CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        // Create User
        try{
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            newUser = await userDAO.createUser(email,hash,phone,firstName,lastName);
        } catch(error) {
            console.log(`Error creating user at: ${FILE_NAME} ${error}`)
            responseObj.code=CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
            return reject(responseObj)
        }
        newUser=newUser.rows[0];
        console.log(newUser)
        return resolve({token : utils.generateJWT(newUser.user_id, newUser.email, newUser.phone, 
            newUser.first_name, newUser.last_name, newUser.user_role)});
    });
}

module.exports = {
    login,
    register
}