const express = require("express");
const router = express.Router();
const FILE_NAME = "UserRoute.js";
const sendErrorResponse = require("../Utils/ErrorUtils")._sendErrorResponse;
const userService = require("../Services/UserService");
const { validationResult } = require("express-validator");
const ErrorUtils = require("../Utils/ErrorUtils");
const Validations = require("../Utils/Validations");

/**
 * This route logs in a user
 */
router.post("/", Validations.validateEmail, Validations.validatePassword, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const email = req.body.email;
        const password = req.body.password;
        userService.login(email, password).then(result => {
            console.log(`Success logging user in at: ${FILE_NAME}`);
            return res.send(result);
        }).catch(err => {
            console.log(`Error logging in user at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

/**
 * This route creates a user account
 */
router.post("/register", Validations.validateRegister, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return sendErrorResponse(res, errors);
    } else {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const phone = req.body.phone;
        const email = req.body.email;
        console.log(password)
        userService.register(firstName, lastName, password, phone, email).then(result => {
            console.log(`Success creating user in at: ${FILE_NAME}`);
            return res.send(result);
        }).catch(err => {
            console.log(`Error creating user in at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

router.post("/forgot")

module.exports = router;