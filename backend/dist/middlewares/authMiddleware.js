"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("./asyncHandler"); // or wherever your CustomError is
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new asyncHandler_1.CustomError("Not authenticated. Please login.", 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const user = yield prismaClient_1.default.users.findUnique({
            where: { user_id: BigInt(decoded.user_id) },
        });
        if (!user) {
            throw new asyncHandler_1.CustomError("User not found", 404);
        }
        req.user = user; //  Attach user to request
        next();
    }
    catch (error) {
        const message = error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"
            ? "Invalid or expired token"
            : error.message;
        res.status(401).json({ message, statusCode: 401 });
    }
});
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=authMiddleware.js.map