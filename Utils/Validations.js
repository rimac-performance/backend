const { check } = require('express-validator');
const CONSTANTS = require("../Utils/Constants")

const validateEmail = [
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
]

const validatePassword = [
    check("pswd")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
]

const validateRegister = [
    check("first_name")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("last_name")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("pswd")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("phone")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isInt()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isLength({ min: 10, max: 11 })
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
]

const validateCarID = [
    check("car_id")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
]

const validateCarRegister = [
    check('vin')
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape(),
    check('model')
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD),
    check('year')
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isInt({ min: 2009, max: 9999 })
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_YEAR),
    check('color')
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
]

const validateUser = [
    check("user.user_id")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD),
    check("user.email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL),
]

const validateViewCars = [
    check("user_id")
        .optional()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_EMAIL)
        .trim().escape(),
]

const validateViewRun = [
    check("run_id")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isUUID()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD),
    check("fields")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isArray()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .custom(list => {
            for(const element of list) {
                if (!CONSTANTS.runColumns.includes(element)) {
                    return false;
                }
            }
            return true;
        })
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
]

const validateViewAllRuns = [
    check("car_id")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
]

module.exports = {
    validateEmail,
    validatePassword,
    validateRegister,
    validateCarRegister,
    validateCarID,
    validateUser,
    validateViewCars, 
    validateViewRun,
    validateViewAllRuns
}