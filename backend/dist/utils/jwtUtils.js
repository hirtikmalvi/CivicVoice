"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const big_integer_1 = __importDefault(require("big-integer"));
const JWT_SECRET = process.env.SECRET_KEY;
if (!JWT_SECRET) {
    throw new Error("JWT Secret is missing! Set SECRET_KEY in environment variables.");
}
const generateToken = (uid, role) => {
    try {
        let userId = (0, big_integer_1.default)(uid);
        return jsonwebtoken_1.default.sign({ user_id: userId, role }, JWT_SECRET, { expiresIn: "7d" });
    }
    catch (error) {
        throw new asyncHandler_1.CustomError("Error generating JWT token", 500);
    }
};
exports.generateToken = generateToken;
//# sourceMappingURL=jwtUtils.js.map