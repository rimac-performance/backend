const CONSTANTS = require("./Constants");
/**
 * Error object.
 *
 * @memberof errorUtil
 * @function ErrorInfo
 * @param code the application error code.
 * @param msg the error message
 * @param status the http status to be set.
 */
function ErrorInfo(code, msg, status) {
    this.code = code;
    this.msg = msg;
    this.status = status;
}

/**
 * The map which holds the error configuration details. The app error
 * code is the key which maps to an appropriate ErrorInfo object.
 * The error object is used to create error responses for any given
 * application error code.
 */
const ERROR_LOOKUP_TABLE = new Map([
    [
        CONSTANTS.APP_ERROR_CODE.PASSWORD_MISMATCH,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.PASSWORD_MISMATCH,
            CONSTANTS.ERROR_DESC.PASSWORD_MISMATCH,
            CONSTANTS.ERROR_CODE.BAD_REQUEST,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.USER_EXISTS,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.USER_EXISTS,
            CONSTANTS.ERROR_DESC.USER_ALREADY_EXISTS,
            CONSTANTS.ERROR_CODE.CONFLICT,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.MISSING_FIELD,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.MISSING_FIELD,
            CONSTANTS.ERROR_DESC.MISSING_FIELD,
            CONSTANTS.ERROR_CODE.BAD_REQUEST,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.INVALID_FIELD,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.INVALID_FIELD,
            CONSTANTS.ERROR_DESC.INVALID_FIELD,
            CONSTANTS.ERROR_CODE.BAD_REQUEST,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.DUPLICATE,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.DUPLICATE,
            CONSTANTS.ERROR_DESC.DUPLICATE,
            CONSTANTS.ERROR_CODE.CONFLICT,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.ACCOUNT_ALREADY_VERIFIED,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.ACCOUNT_ALREADY_VERIFIED,
            CONSTANTS.ERROR_DESC.ACCOUNT_ALREADY_VERIFIED,
            CONSTANTS.ERROR_CODE.BAD_REQUEST,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.INVALID_EMAIL_OR_PASSWORD,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.INVALID_EMAIL_OR_PASSWORD,
            CONSTANTS.ERROR_DESC.EMAIL_OR_PASSWORD,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.INCORRECT_PASSWORD_COMPLEXITY,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.INCORRECT_PASSWORD_COMPLEXITY,
            CONSTANTS.ERROR_DESC.INCORRECT_PASSWORD_COMPLEXITY,
            CONSTANTS.ERROR_CODE.BAD_REQUEST,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR,
            CONSTANTS.ERROR_DESC.FAILED,
            CONSTANTS.ERROR_CODE.FAILED,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.NOT_FOUND,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.NOT_FOUND,
            CONSTANTS.ERROR_DESC.NOT_FOUND,
            CONSTANTS.ERROR_CODE.NOT_FOUND,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.EDITOR_NOT_FOUND,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.EDITOR_NOT_FOUND,
            CONSTANTS.ERROR_DESC.EDITOR_NOT_FOUND,
            CONSTANTS.ERROR_CODE.NOT_FOUND,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.TOKEN_EXPIRED,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.TOKEN_EXPIRED,
            CONSTANTS.ERROR_DESC.TOKEN_EXPIRED,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.TOKEN_NOT_FOUND,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.TOKEN_NOT_FOUND,
            CONSTANTS.ERROR_DESC.INVALID_TOKEN,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.NO_CONTENT,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.NO_CONTENT,
            CONSTANTS.ERROR_DESC.NOT_FOUND,
            CONSTANTS.ERROR_CODE.NO_CONTENT,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.MISSING_TOKEN,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.MISSING_TOKEN,
            CONSTANTS.ERROR_DESC.NOT_FOUND,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.UNAUTHORIZED,
            CONSTANTS.ERROR_DESC.UNAUTHORIZED,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.EMAIL,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.EMAIL,
            CONSTANTS.ERROR_DESC.EMAIL,
            CONSTANTS.ERROR_CODE.FAILED,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.TIME,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.TIME,
            CONSTANTS.ERROR_DESC.TIME,
            CONSTANTS.ERROR_CODE.BAD_REQUEST,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.FILE_TYPE,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.FILE_TYPE,
            CONSTANTS.ERROR_DESC.FILE_TYPE,
            CONSTANTS.ERROR_CODE.BAD_REQUEST,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.FILE_SIZE,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.FILE_SIZE,
            CONSTANTS.ERROR_DESC.FILE_SIZE,
            CONSTANTS.ERROR_CODE.BAD_REQUEST,
        ),
    ],
    [
        CONSTANTS.APP_ERROR_CODE.CAR_EXISTS,
        new ErrorInfo(
            CONSTANTS.APP_ERROR_CODE.CAR_EXISTS,
            CONSTANTS.ERROR_DESC.CAR_ALREADY_EXISTS,
            CONSTANTS.ERROR_CODE.CONFLICT,
        ),
    ],
]);

/**
 * Gets the ErrorInfo object for the specified key.
 *
 * @memberof errorUtil
 * @function getErrorInfo
 * @param {Number} error_key the application error code.
 */
function getErrorInfo(errorKey) {
    const eKey = errorKey ? errorKey : CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR;
    return ERROR_LOOKUP_TABLE.has(eKey)
        ? ERROR_LOOKUP_TABLE.get(eKey)
        : ERROR_LOOKUP_TABLE.get(CONSTANTS.APP_ERROR_CODE.UNKNOWN_ERROR);
}

/**
 * @description helper function which maps the errors from the service to the response expected from the POST endpoint
 * @memberof requestMapper
 * @function validateError
 * @param {object} errors the errors obtained from the service
 * @returns {object} the response expected from the endpoint for a successful transaction
 */
function validateError(errors) {
    const missingData = [];
    const invalidData = [];
    const incorrectPasswordData = [];
    let responseObj = {};
    errors.forEach(error => {
        const missingObj = {};
        const invalidObj = {};
        const incorrectPasswordObj = {};
        if (error.msg === CONSTANTS.ERROR_DESC.MISSING_FIELD) {
            missingObj.field = error.param;
            missingData.push(missingObj);
        }
        if (error.msg === CONSTANTS.ERROR_DESC.INVALID_FIELD) {
            invalidObj[error.param] = error.value;
            invalidData.push(invalidObj);
        }
        if (error.msg === CONSTANTS.ERROR_DESC.INCORRECT_PASSWORD_COMPLEXITY) {
            incorrectPasswordObj[error.param] = error.value;
            incorrectPasswordData.push(incorrectPasswordObj);
        }
    });
    if (missingData.length !== 0) {
        responseObj = getErrorInfo(CONSTANTS.APP_ERROR_CODE.MISSING_FIELD);
        responseObj.fields = missingData;
    } else if (invalidData.length !== 0) {
        responseObj = getErrorInfo(CONSTANTS.APP_ERROR_CODE.INVALID_FIELD);
        responseObj.fields = invalidData;
    } else if (incorrectPasswordData.length !== 0) {
        responseObj = getErrorInfo(
            CONSTANTS.APP_ERROR_CODE.INCORRECT_PASSWORD_COMPLEXITY,
        );
        responseObj.fields = incorrectPasswordData;
    }
    return responseObj;
}

/**
 * Used to send back a response object to the client
 * @param  {Object} responseObj
 * @param  {Object} errorInfo
 * @param  {Response} res
 */
function sendResponse(res, responseObj, errorInfo) {
    res.status(errorInfo.status);
    responseObj.response_code = errorInfo.status;
    responseObj.code = errorInfo.code;
    responseObj.description = errorInfo.msg;
    res.send(responseObj);
}

/**
 * Helper function to form and send error response
 */
function _sendErrorResponse(res, errors) {
    const resObj = {};
    const responseBody = [];
    const errorInfo = validateError(errors.array());
    resObj.code = errorInfo.code;
    resObj.message = errorInfo.msg;
    resObj.data = errorInfo.fields;
    responseBody.push(resObj);
    res.status(errorInfo.status);
    res.send(responseBody).end();
}

/**
 * @description Sends success object to client
 * @memberof requestMapper
 * @function validateError
 * @param {object} res The response object
 * @param {object} result the result object
 * @returns {object} the response expected from the endpoint for a successful transaction
 */
function success(res, result) {
    res.status(CONSTANTS.ERROR_CODE.SUCCESS);
    return result;
}

/**
 * Middleware function to handle error responses in the correct format:
 *
 */
function handleJWTError(err, req, res, next) {
    if (err.name === CONSTANTS.ERROR_DESC.JWT_UNAUTHORIZED) {
        // If token is expired
        if (err.message === CONSTANTS.ERROR_DESC.JWT_EXPIRED) {
            return res
                .status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
                .json({
                    code: CONSTANTS.APP_ERROR_CODE.TOKEN_EXPIRED,
                    status: CONSTANTS.ERROR_CODE.UNAUTHORIZED,
                    message: CONSTANTS.ERROR_DESC.TOKEN_EXPIRED,
                })
                .end();
            // If an invalid token
        } else if (err.message === CONSTANTS.ERROR_DESC.MISSING_TOKEN) {
            return res
                .status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
                .json({
                    code: CONSTANTS.APP_ERROR_CODE.MISSING_TOKEN,
                    status: CONSTANTS.ERROR_CODE.UNAUTHORIZED,
                    message: CONSTANTS.ERROR_DESC.MISSING_TOKEN_MESSAGE,
                })
                .end();
        } else {
            return res
                .status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
                .json({
                    code: CONSTANTS.APP_ERROR_CODE.TOKEN_NOT_FOUND,
                    status: CONSTANTS.ERROR_CODE.UNAUTHORIZED,
                    message: CONSTANTS.ERROR_DESC.INVALID_TOKEN,
                })
                .end();
        }
    }
    return null;
}

module.exports = Object.freeze({
    getErrorInfo,
    validateError,
    sendResponse,
    _sendErrorResponse,
    success,
    handleJWTError,
});