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
exports.loginUser = exports.registerUser = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const client_1 = require("@prisma/client");
const hashPassword_1 = require("../utils/hashPassword");
const jwtUtils_1 = require("../utils/jwtUtils");
const validations_1 = require("../utils/validations");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validations for user
    (0, validations_1.isValidUser)(data);
    const { fullname, email, password, role, role_based_data } = data;
    // Check if email already exists
    const foundUser = yield prismaClient_1.default.users.findFirst({ where: { email } });
    if (foundUser) {
        throw new asyncHandler_1.CustomError("Email already exists", 409);
    }
    if (role === client_1.users_role.Citizen)
        yield (0, validations_1.isValidCitizen)(role_based_data);
    else if (role === client_1.users_role.Authority)
        (0, validations_1.isValidAuthority)(role_based_data);
    const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
    // Creating User
    const newUser = yield prismaClient_1.default.users.create({
        data: {
            fullname,
            email,
            password: hashedPassword,
            role
        }
    });
    // Creation of role-based entries
    if (role === client_1.users_role.Citizen) {
        yield prismaClient_1.default.citizen.create({
            data: Object.assign({ user_id: newUser.user_id }, role_based_data)
        });
    }
    else if (role === client_1.users_role.Authority) {
        (0, validations_1.isValidAuthority)(role_based_data);
        yield prismaClient_1.default.authority.create({
            data: Object.assign({ user_id: newUser.user_id }, role_based_data)
        });
    }
    else if (role === client_1.users_role.Admin) {
        yield prismaClient_1.default.admins.create({
            data: { user_id: newUser.user_id }
        });
    }
    else {
        throw new asyncHandler_1.CustomError("Invalid role provided", 400);
    }
    return newUser;
});
exports.registerUser = registerUser;
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