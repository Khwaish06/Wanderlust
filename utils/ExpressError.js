class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // ✅ This sets the error message in the base Error class
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
