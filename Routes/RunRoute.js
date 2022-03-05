const express = require("express");
const router = express.Router();
const FILE_NAME = "RunRoute.js";
const sendErrorResponse = require("../Utils/ErrorUtils")._sendErrorResponse;
const { validationResult } = require("express-validator");
const ErrorUtils = require("../Utils/ErrorUtils");
const Validations = require("../Utils/Validations");
const { check } = require('express-validator');
const authenticateJWT = require("../Utils/Utils").authenticateJWT;
const runService = require("../Services/RunService")
const CONSTANTS = require("../Utils/Constants")
const multer = require('multer')
const upload = multer({
    dest: './uploads/',
    fileFilter: function (req, file, cb) {
        return file.mimetype === 'text/csv' ? cb(null, true) : cb(new Error(), false)
    }
}).single("run")

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
        runService.viewRuns(runID, fields).then(result => {
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

/**
 * This route uploads a run
 */
router.post("/", authenticateJWT, (req, res) => {
    const responseObj = {}
    const user = req.body.user
    upload(req, res, async function (err) {
        // Check if file is missing or invalid
        if (err || !req.file) {
            return res.status(400).send([{ message: "File Type Must Be CSV", data: "run" }])
        }
        // Perform validations
        await check('name')
            .exists()
            .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
            .trim().escape()
            .isString()
            .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
            .not().isEmpty()
            .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
            .run(req);
        await check('car_id')
            .exists()
            .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
            .trim().escape()
            .isString()
            .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
            .not().isEmpty()
            .withMessage(CONSTANTS.ERROR_DESC.MISSING_FIELD)
            .isUUID()
            .withMessage(CONSTANTS.ERROR_DESC.INVALID_FIELD)
            .run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, errors);
        }
        const userID = user.user_id;
        const runName = req.body.name
        const file = req.file
        const carID = req.body.car_id
        runService.uploadRun(userID, carID, runName, file).then(result => {
            res.send(result)
        }).catch(err => {
            console.log(`Error uploading run at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    })
})

module.exports = router;