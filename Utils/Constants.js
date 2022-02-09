const ERROR_DESC = {
    NOT_FOUND: "The requested resource was not found or empty!",
    NO_RESOURCE: "Sorry can't find that resource!",
    TOKEN_NOT_FOUND: "token not found",
    INVALID_FIELD: "invalid parameters",
    MISSING_FIELD: "missing parameters",
    WRONG_PASSWORD: "please check your password",
    USER_NOT_FOUND: "user not found",
    INVALID_TOKEN: "token invalid or expired",
    EMAIL_OR_PASSWORD: "email or password invalid'",
    NOT_LOGGEDIN: "you must be logged in to do that!",
    SUCCESS: "success",
    FAILED: "Not your fault!",
    PASSWORD_MISMATCH: "password does not match",
    INCORRECT_PASSWORD_COMPLEXITY:
        "password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long",
    INVALID_EMAIL: "email is invalid!",
    USER_ALREADY_EXISTS: "user already exists!",
    DUPLICATE: "duplicate entry",
    TOKEN_EXPIRED: "token expired",
    PASSWORD_RESET: "reset your password",
    ACTIVATE_ACCOUNT: "activate your account",
    JWT_UNAUTHORIZED: "UnauthorizedError",
    JWT_EXPIRED: "Expired token provided!",
    MISSING_TOKEN: "No authorization token was found",
    MISSING_TOKEN_MESSAGE: "missing authorization token",
    INVALID_PHONE_LENGTH: "invalid phone length"
};

const APP_ERROR_CODE = Object.freeze({
    USER_EXISTS: 1,
    PASSWORD_MISMATCH: 2,
    INCORRECT_PASSWORD_COMPLEXITY: 3,
    DUPLICATE: 4,
    MISSING_FIELD: 5,
    INVALID_FIELD: 6,
    TOKEN_EXPIRED: 7,
    TOKEN_NOT_FOUND: 8,
    INVALID_EMAIL_OR_PASSWORD: 9,
    NOT_FOUND: 10,
    NO_CONTENT: 11,
    MISSING_TOKEN: 12,
    ACCOUNT_ALREADY_VERIFIED: 13,
    EDITOR_NOT_FOUND: 14,
    UNAUTHORIZED: 15,
    EMAIL: 16,
    TIME: 17,
    FILE_TYPE: 18,
    FILE_SIZE: 19,
    UNKNOWN_ERROR: -1,
});

const ERROR_CODE = {
    NOT_FOUND: 404,
    NO_DATA_FOUND: 403,
    INVALID_MISSING_PARAMETER: 422,
    SUCCESS: 200,
    NO_CONTENT: 204,
    FAILED: 500,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    CONFLICT: 409
};

module.exports = {
    ERROR_DESC,
    APP_ERROR_CODE,
    ERROR_CODE
}