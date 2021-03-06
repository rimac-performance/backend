const { check } = require('express-validator');
const CONSTANTS = require("../Utils/Constants")
const vinValidator = require("vin-validator")
const shortid = require("shortid")
const passwordRegex = require("../Utils/Utils").passwordRegex

const validateEmail = [
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
]

const validatePassword = [
    check("pswd")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .matches(passwordRegex)
        .withMessage(CONSTANTS.ERROR_DESC.INCORRECT_PASSWORD_COMPLEXITY)
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
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .matches(passwordRegex)
        .withMessage(CONSTANTS.ERROR_DESC.INCORRECT_PASSWORD_COMPLEXITY),
    check("phone")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isMobilePhone()
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
        .custom(value => {
            return vinValidator.validate(value);
        })
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
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
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
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

const validateSensorStatus = [
    check("sensors")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isArray()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("sensors.*.name")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("sensors.*.status")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isInt({min:1, max:2})
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)

]

const validateSensorThreshold = [
    check("sensors")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isArray()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("sensors.*.name")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("sensors.*.threshold")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .isFloat()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)

]

const validateResetPassword = [
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("pswd")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .matches(passwordRegex)
        .withMessage(CONSTANTS.ERROR_DESC.INCORRECT_PASSWORD_COMPLEXITY),
    check("resetCode")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .custom(value => {
            return shortid.isValid(value);
        }),
]

const validateSendRun = [
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
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
]

const validateAdminUserRegister = [
    check("pswd")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .matches(passwordRegex)
        .withMessage(CONSTANTS.ERROR_DESC.INCORRECT_PASSWORD_COMPLEXITY),
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("phone")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isMobilePhone()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
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
    check("user_role")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isInt({min: 1, max:3})
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
]

const validateAdminUserUpdate = [
    check("user_id")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD),
    check("pswd")
        .optional()
        .escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .matches(passwordRegex)
        .withMessage(CONSTANTS.ERROR_DESC.INCORRECT_PASSWORD_COMPLEXITY),
    check("email")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isEmail()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
    check("phone")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isMobilePhone()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
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
    check("user_role")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isInt({min: 1, max:3})
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD),
]

const validateUserID = [
    check("user_id")
        .exists()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
        .trim().escape()
        .isString()
        .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
        .not().isEmpty()
        .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD),
]


const validateRunID = [
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
    validateViewAllRuns,
    validateSensorStatus,
    validateSensorThreshold,
    validateResetPassword,
    validateSendRun,
    validateAdminUserRegister,
    validateUserID,
    validateRunID,
    validateAdminUserUpdate
}