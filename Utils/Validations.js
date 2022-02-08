const { check } = require('express-validator');
const CONSTANTS = require("../Utils/Constants")

const validateEmail = [
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .trim().escape()
]

const validatePassword = [
    check("password")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
]

module.exports = {
    validateEmail,
    validatePassword
}