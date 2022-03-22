const express = require("express");
const router = express.Router();
const FILE_NAME = "AdminRoute.js";
const sendErrorResponse = require("../Utils/ErrorUtils")._sendErrorResponse;
const adminService = require("../Services/AdminService");
const { validationResult } = require("express-validator");
const ErrorUtils = require("../Utils/ErrorUtils");
const Validations = require("../Utils/Validations");
const authenticateJWT = require("../Utils/Utils").authenticateJWT;

/**
 * This route allows an admin to create a user
 */
router.post("/", authenticateJWT, Validations.validateAdminUserRegister, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const password = req.body.pswd;
        const email = req.body.email;
        const phone = req.body.phone;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const userRole = req.body.user_role;
        const adminRole = req.body.user.user_role;
        adminService.insertUser(password, email, phone, firstName, lastName, userRole, adminRole).then(result => {
            console.log(`Success inserting user from admin in ${FILE_NAME}`)
            return res.send(result)
        }).catch(err => {
            console.log(`Error inserting user from admin at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

/**
 * This route allows an admin or engineer to view a user
 */
router.get("/", authenticateJWT, Validations.validateUserID, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const userID = req.query.user_id;
        const adminRole = req.body.user.user_role;
        adminService.getUser(userID, adminRole).then(result => {
            console.log(`Success getting user at ${FILE_NAME}`);
            return res.send(result)
        }).catch(err => {
            console.log(`Error getting user at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

/**
 * This route gets all users if the user is an engineer or an admin
 */
router.get("/all", authenticateJWT, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const adminRole = req.body.user.user_role;
        adminService.getAllUsers(adminRole).then(result => {
            console.log(`Success getting all users at ${FILE_NAME}`)
            return res.send(result)
        }).catch(err => {
            console.log(`Error getting all users at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

router.put("/", authenticateJWT, (req, res) => {
    
})

/**
 * This route deletes a user from the database
 */
router.delete("/", authenticateJWT, Validations.validateUserID, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const userID = req.query.user_id;
        const adminRole = req.body.user.user_role;
        adminService.deleteUser(userID, adminRole).then(result => {
            console.log(`Success deleting user at ${FILE_NAME}`)
            return res.send(result);
        }).catch(err => {
            console.log(`Error deleting user at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

module.exports = router;