const express = require("express");
const router = express.Router();
const FILE_NAME = "SensorRoute.js";
const sendErrorResponse = require("../Utils/ErrorUtils")._sendErrorResponse;
const { validationResult } = require("express-validator");
const ErrorUtils = require("../Utils/ErrorUtils");
const Validations = require("../Utils/Validations");
const authenticateJWT = require("../Utils/Utils").authenticateJWT;
const sensorService = require("../Services/SensorService")

router.put("/status", authenticateJWT, Validations.validateSensorStatus, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const userID = req.body.user.user_id;
        const role = req.body.user.user_role;
        const sensors = req.body.sensors;
        sensorService.updateStatus(userID, role, sensors).then(result => {
            console.log(`Successfully updated status at ${FILE_NAME}`)
            return res.send(result);
        }).catch(err => {
            console.log(`Error updating status at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

router.put("/threshold", authenticateJWT, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const userID = req.body.user.user_id;
        const role = req.body.user.user_role;
        const sensors = req.body.sensors;
        sensorService.updateThreshold(userID, role, sensors).then(result => {
            console.log(`Successfully updated threshold at ${FILE_NAME}`)
            return res.send(result);
        }).catch(err => {
            console.log(`Error updating threshold at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})


module.exports = router;