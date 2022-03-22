const express = require("express");
const router = express.Router();
const FILE_NAME = "CarRoute.js";
const sendErrorResponse = require("../Utils/ErrorUtils")._sendErrorResponse;
const { validationResult } = require("express-validator");
const ErrorUtils = require("../Utils/ErrorUtils");
const Validations = require("../Utils/Validations");
const authenticateJWT = require("../Utils/Utils").authenticateJWT;
const carService = require("../Services/CarService")

/**
 * This route creates a car under a user
 */
router.post("/", authenticateJWT, Validations.validateUser, Validations.validateCarRegister, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const userID = req.body.user.user_id;
        const vin = req.body.vin;
        const model = req.body.model;
        const year = req.body.year;
        const color = req.body.color;
        carService.registerCar(userID, vin, model, year, color).then(result => {
            console.log(`Success registering car at ${FILE_NAME}`)
            return res.send(result)
        }).catch(err => {
            console.log(`Error registering car at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

/**
 * This route returns the cars based on a users id
 */
router.get("/", authenticateJWT, Validations.validateViewCars, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const userID = req.query.user_id;
        const jwtUserID = req.body.user.user_id;
        const role = req.body.user.user_role;
        carService.viewCars(userID, jwtUserID, role).then(result => {
            console.log(`Success viewing cars in ${FILE_NAME}`)
            return res.send(result)
        }).catch(err => {
            console.log(`Error viewing cars at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

/**
 * This route returns the cars based on a users id
 */
 router.get("/all", authenticateJWT, Validations.validateViewCars, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const role = req.body.user.user_role;
        carService.viewAllCars(role).then(result => {
            console.log(`Success viewing all cars in ${FILE_NAME}`)
            return res.send(result)
        }).catch(err => {
            console.log(`Error viewing all cars at: ${FILE_NAME} ${err}`);
            const errorInfo = ErrorUtils.getErrorInfo(err.code);
            return ErrorUtils.sendResponse(res, responseObj, errorInfo);
        })
    }
})

/**
 * This route will map an engineer/admin to a car
 */
router.post("/admin", authenticateJWT, Validations.validateCarID, (req, res) => {
    const responseObj = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendErrorResponse(res, errors);
    } else {
        const userID = req.body.user.user_id;
        const carID = req.body.car_id;
        
    }
});

module.exports = router;