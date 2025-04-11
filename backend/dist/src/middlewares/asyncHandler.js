"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.asyncHandler = void 0;
// A custom error type to include statusCode
class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.CustomError = CustomError;
// Async Handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        const statusCode = error instanceof CustomError ? error.statusCode : 500;
        res.status(statusCode).json({
            message: error.message || "Internal Server Error",
            statusCode,
        });
    });
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map