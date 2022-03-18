const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userDAO = require("../DAO/UserDAO");
const FILE_NAME = "Utils.js";
const CONSTANTS = require("./Constants");

/**
 * 
 *  This function creates a JWT based off of the user's profile
 * 
 * @returns 
 */
function generateJWT(userID, email, phone, firstName, lastName, userRole) {
    return jwt.sign({
        user_id: userID, email: email, phone: phone, first_name: firstName,
        last_name: lastName, user_role: userRole
    }, process.env.JWT_SECRET)
}

// This function verifies a jwt
function verifyJWT(token) {
    return new Promise(async (resolve, reject) => {
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

// This function authenticates a user with jwt as a middleware
const authenticateOptionalJWT = async (req, res, next) => {
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
        return next();
    }
}

async function mail(options) {
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
            return resolve(await transporter.sendMail(options));
        } catch (error) {
            console.log(`Error sending email in ${FILE_NAME}: ${error}`)
            return reject(error);
        }
    })
}

function isFileValid(file) {
    const type = file.type.split("/").pop();
    const validTypes = ["csv"];
    if (validTypes.indexOf(type) === -1) {
        return false;
    }
    return true;
};

function forgotEmailTemplate(code) {
    return `<!DOCTYPE html>
    <html lang="en" xmlns="https://www.w3.org/1999/xhtml/" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <title>Reset Password</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            table, td, div, h1, p {font-family: Roboto, Arial, sans-serif;}
            .button{
                background-color: #000000;
                color: #ffffff;
                font-family: Roboto, Arial, sans-serif;
                padding: 15px 32px;
                text-decoration: none;
                font-weight: bold;
                text-transform: uppercase;
                text-align: center;
                border-radius: 4px;
                margin:0 auto;
                display: block;
            }
            .button:hover {
                background-color: #E9591C;
            }
            /*table, td {border:2px solid #000000 !important;}*/
        </style>
    </head>
        <body style="margin:0;padding:0;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
                <tr>
                    <td align="center" style="padding:40px 0 30px 0;background: #ffffff;">
                        <img src="Rev_Performance_Header.png" alt="Rev Performance logo" width="300" style="height:auto;display:block;" cid="performanceHeader"/>
                    </td>
                </tr>    
                <tr>
                    <td style="padding:36px 30px 42px 30px;">
                        <h1>Reset your password</h1>
                        <p>A request has been sent to reset your password for Rev Performance. To reset your password, click the button below.</p>
                        <a href="${process.env.FRONTEND_URL}${code}" class="button">reset your password</a>
                        <p>If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>
                    </td>
                </tr>
            </table>
        </body>
    </html>`
}

const validMimeTypes = [`text/x-csv`,
    `application/vnd.ms-excel`,
    `application/csv`,
    `application/x-csv`,
    `text/csv`,
    `text/comma-separated-values`,
    `text/x-comma-separated-values`]

function isValidMimeType(type) {
    if (validMimeTypes.includes(type)) {
        return true;
    }
    return false;
}

module.exports = {
    generateJWT,
    mail,
    authenticateJWT,
    authenticateOptionalJWT,
    isFileValid,
    forgotEmailTemplate,
    isValidMimeType
}