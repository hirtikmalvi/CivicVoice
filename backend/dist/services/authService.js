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
exports.loginUser = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const hashPassword_1 = require("../utils/hashPassword");
const jwtUtils_1 = require("../utils/jwtUtils");
const asyncHandler_1 = require("../middlewares/asyncHandler");
// For Login
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    // Validations
    if (!email || !password)
        throw new asyncHandler_1.CustomError("All fields are required", 400);
    if (email.trim() === "")
        throw new asyncHandler_1.CustomError("Email can't be empty", 400);
    if (password.trim() === "")
        throw new asyncHandler_1.CustomError("Password can't be empty", 400);
    const user = yield prismaClient_1.default.users.findFirst({ where: { email } });
    if (!user)
        throw new asyncHandler_1.CustomError("Invalid email or password", 401);
    const isMatch = yield (0, hashPassword_1.comparePassword)(password, user.password);
    if (!isMatch)
        throw new asyncHandler_1.CustomError("Invalid email or password", 401);
    const token = (0, jwtUtils_1.generateToken)(user.user_id, user.role);
    return { token, user };
});
exports.loginUser = loginUser;
//# sourceMappingURL=authService.js.map