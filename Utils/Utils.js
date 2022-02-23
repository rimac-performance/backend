const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userDAO = require("../DAO/UserDAO");
const FILE_NAME = "Utils.js";
const CONSTANTS = require("./Constants");

/**
 * 
 *  This function creates a JWT based off of the secret and the user's email
 * 
 * @param {*} email user's email
 * @returns 
 */
function generateJWT(userID, email, phone, firstName, lastName, userRole) {
    return jwt.sign({
        userID: userID, email: email, phone: phone, firstName: firstName,
        lastName: lastName, userRole: userRole
    }, process.env.JWT_SECRET)
}

// This function verifies a jwt
function verifyJWT(token) {
    return new Promise(async(resolve, reject) => {
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)
            // check if email field exists
            if (!decoded.email) {
                return reject(false);
            }
            // check if the user is in the db
            const user = await userDAO.getUser(decoded.email);
            if (user.rows.length == 0) {
                return reject(false);
            }
            return resolve(user.rows[0]);
        } catch (error) {
            return reject(false);
        }
    });
}

// This function authenticates a user with jwt as a middleware
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            req.body.user = await (verifyJWT(token));
            return next();
        } catch (error) {
            return res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED).json({
                code: CONSTANTS.APP_ERROR_CODE.INVALID_TOKEN,
                status: CONSTANTS.ERROR_CODE.INVALID_MISSING_PARAMETER,
                message: CONSTANTS.ERROR_DESC.INVALID_TOKEN
            })
        }
    } else {
        return res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED).json({
            code: CONSTANTS.APP_ERROR_CODE.TOKEN_NOT_FOUND,
            status: CONSTANTS.ERROR_CODE.NOT_FOUND,
            message: CONSTANTS.ERROR_DESC.TOKEN_NOT_FOUND
        })
    }
}

async function mail(to, subject, html) {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER, // generated ethereal user
                    pass: process.env.EMAIL_PASS, // generated ethereal password
                },
            });
            return resolve(await transporter.sendMail({
                from: process.env.EMAIL_USER, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: "", // plain text body
                html: html, // html body
              }));
        } catch (error) {
            console.log(`Error sending email in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

// function returnUserFromAuth(req) {
//     return new Promise(async(resolve, reject) => {
//         const authHeader = req.headers.authorization;
//         let token;
//         if (authHeader) {
//             token = authHeader.split(' ')[1];
//         }
//         try {
//             const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//             const user = await userDAO.getUser(decoded.email);
//             if (user.rows.length != 0) {
//                 return resolve(user.rows[0]);
//             } else {
//                 return reject(CONSTANTS.APP_ERROR_CODE.NOT_FOUND)
//             }
//         } catch (error) {
//             console.log(`Error getting user from auth header at ${FILE_NAME}: ${error}`)
//             return reject(error);
//         }
//     });
// }

module.exports = {
    generateJWT,
    mail,
    authenticateJWT
}