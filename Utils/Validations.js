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
    check("pswd")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .escape()
]

const validateRegister = [
    check("first_name")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim().escape(),
    check("last_name")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim().escape(),
    check("pswd")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .escape(),
    check("phone")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isInt()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isLength({ min: 10, max: 11 })
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim().escape(),
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim().escape()
]

const validateCarID = [
    check("car_id")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .trim().escape(),
]

const validateCarRegister = [
    check('vin')
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape(),
    check('model')
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape(),
    check('year')
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isInt({ min: 2009, max: 9999 })
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_YEAR)
        .trim().escape(),
    check('color')
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape(),
]

const validateUser = [
    check("user.user_id")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape(),
    check("user.email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .trim().escape(),
]

const validateViewCars = [
    check("user_id")
        .optional()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .trim().escape(),
]

module.exports = {
    validateEmail,
    validatePassword,
    validateRegister,
    validateCarRegister,
    validateCarID,
    validateUser,
    validateViewCars
}