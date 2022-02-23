const express = require("express");
const router = express.Router();
const FILE_NAME = "UserRoute.js";
const sendErrorResponse = require("../Utils/ErrorUtils")._sendErrorResponse;
const userService = require("../Services/UserService");
const { validationResult } = require("express-validator");
const ErrorUtils = require("../Utils/ErrorUtils");
const Validations = require("../Utils/Validations");
const authenticateJWT = require("../Utils/Utils").authenticateJWT;


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
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const password = req.body.pswd;
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

/**
 * This route sends an email with a link to reset their password
 */
router.put("/forgot", Validations.validateEmail, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return sendErrorResponse(res, errors);
    } else {
        const email = req.body.email;
        userService.forgot(email).then(result => {
            console.log(`Success sending reset link at: ${FILE_NAME}`);
            return res.send(result);
        }).catch(err => {
            console.log(`Error sending reset link at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

/**
 * This route returns the current user if the user is a car owner. If the
 * user is an engineer or admin, then all users are returnes
 */
router.get("/", authenticateJWT, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return sendErrorResponse(res, errors);
    } else {
        const userID = req.body.user.user_id;
        const role = req.body.user.user_role;
        userService.viewUsers(userID, role).then(result => {
            console.log(`Success viewing users at ${FILE_NAME}`);
            return res.send(result);
        }).catch(err => {
            console.log(`Error viewing users at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

router.get("/insert", (req, res) => {
    const password = "Password123"
    userService.testInsert(password).then(result => {
        return res.send(result)
    }).catch(error => {
        return res.send(error)
    })
})

module.exports = router;