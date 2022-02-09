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

const validateRegister = [
    check("firstName")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim()
        .escape(),
    check("lastName")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim()
        .escape(),
    check("password")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim()
        .escape(),
    check("phone")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isInt()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isLength({ min: 10, max: 11 })
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim()
        .escape(),
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim().escape()
]

module.exports = {
    validateEmail,
    validatePassword,
    validateRegister
}