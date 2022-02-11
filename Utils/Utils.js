const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")

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

async function mail(to, subject, html) {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "rimacapp@gmail.com", // generated ethereal user
                    pass: `:]M"94]-Uw6~eN.S`, // generated ethereal password
                },
            });
            return resolve(await transporter.sendMail({
                from: "rimacapp@gmail.com", // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: "", // plain text body
                html: html, // html body
              }));
        } catch (error) {
            return reject(error);
        }
    })
}

module.exports = {
    generateJWT,
    mail
}