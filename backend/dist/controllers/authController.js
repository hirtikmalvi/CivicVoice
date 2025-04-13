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
exports.handleLogout = exports.handleLogin = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const authService_1 = require("../services/authService");
const asyncHandler_2 = require("../middlewares/asyncHandler");
const big_integer_1 = __importDefault(require("big-integer"));
exports.handleLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, token } = yield (0, authService_1.loginUser)(req.body);
    if (!user || !token) {
        throw new asyncHandler_2.CustomError("Error in login", 401);
    }
    res
        .status(200)
        .cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, // Security improvement
        secure: process.env.NODE_ENV === "production", // Enable in production
        sameSite: "strict",
    })
        .json({
        message: "Login successful",
        success: true,
        token,
        user: Object.assign(Object.assign({}, user), { user_id: (0, big_integer_1.default)(user.user_id) }),
    });
}));
exports.handleLogout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .status(200)
        .clearCookie("token")
        .json({ success: true, message: "Logged out successfully" });
}));
//# sourceMappingURL=authController.js.map