const jwt = require("jsonwebtoken");

/**
 * 
 *  This function creates a JWT based off of the secret and the user's email
 * 
 * @param {*} email user's email
 * @returns 
 */
function generateJWT(userID, email, phone, firstName, lastName, userRole) {
    return jwt.sign({ userID: userID, email: email, phone: phone, firstName: firstName, 
        lastName:lastName, userRole: userRole}, process.env.JWT_SECRET)
}


module.exports = {
    generateJWT
}