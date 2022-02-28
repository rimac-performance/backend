const express = require("express");
const router = express.Router();
const FILE_NAME = "RunRoute.js";
const sendErrorResponse = require("../Utils/ErrorUtils")._sendErrorResponse;
const { validationResult } = require("express-validator");
const ErrorUtils = require("../Utils/ErrorUtils");
const Validations = require("../Utils/Validations");
const authenticateJWT = require("../Utils/Utils").authenticateJWT;
const runService = require("../Services/RunService")

/**
 * This route gets run data from a car
 */
router.post("/view", Validations.validateViewRun, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        //const jwtUserID = req.body.user.user_id;
        //const role = req.body.user.user_role;
        const runID = req.body.run_id;
        const fields = req.body.fields;
        runService.viewRuns(runID,fields).then(result => {
            console.log(`Success viewing run at ${FILE_NAME}`)
            return res.send(result);
        }).catch(err => {
            console.log(`Error viewing run at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
});

/**
 * This route returns all runs
 */
router.get("/", authenticateJWT, Validations.validateViewAllRuns, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const jwtUserID = req.body.user.user_id;
        const role = req.body.user.user_role;
        const carID = req.query.car_id;
        runService.viewAllRuns(jwtUserID, carID, role).then(result => {
            console.log(`Success viewing all runs at ${FILE_NAME}`)
            return res.send(result);
        }).catch(err => {
            console.log(`Error viewing all runs at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

module.exports = router;