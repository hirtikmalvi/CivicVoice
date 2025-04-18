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
exports.getAdminProfile = exports.deleteAdmin = exports.registerAdmin = void 0;
const hashPassword_1 = require("../utils/hashPassword");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const client_1 = require("@prisma/client");
const validations_1 = require("../utils/validations");
const big_integer_1 = __importDefault(require("big-integer"));
exports.registerAdmin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password } = req.body;
    yield (0, validations_1.isValidUser)(fullname, email, password);
    const hashed = yield (0, hashPassword_1.hashPassword)(password);
    const user = yield prismaClient_1.default.users.create({
        data: {
            fullname,
            email,
            password: hashed,
            role: client_1.users_role.Admin,
        },
    });
    const admin = yield prismaClient_1.default.admins.create({
        data: { user_id: user.user_id },
    });
    res.status(201).json({
        success: true,
        message: "Admin registered",
        user: Object.assign(Object.assign({}, user), { user_id: (0, big_integer_1.default)(user.user_id) }),
        admin: Object.assign(Object.assign({}, admin), { user_id: (0, big_integer_1.default)(admin.user_id), admin_id: (0, big_integer_1.default)(admin.admin_id) })
    });
}));
//delete admin
exports.deleteAdmin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
    if (!userId) {
        throw new asyncHandler_1.CustomError("Unauthorized access", 401);
    }
    const existingUser = yield prismaClient_1.default.users.findUnique({
        where: { user_id: userId }
    });
    if (!existingUser) {
        throw new asyncHandler_1.CustomError("User profile not found", 404);
    }
    const existingAdmin = yield prismaClient_1.default.admins.findUnique({
        where: { user_id: userId },
    });
    if (!existingAdmin) {
        throw new asyncHandler_1.CustomError("Admin profile not found", 404);
    }
    // Delete admin record
    yield prismaClient_1.default.admins.delete({ where: { user_id: userId } });
    // Delete user record
    yield prismaClient_1.default.users.delete({ where: { user_id: userId } });
    // Clear token cookie
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Admin profile deleted successfully",
    });
}));
//get admin profile
exports.getAdminProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
    if (!userId) {
        throw new asyncHandler_1.CustomError("Unauthorized access", 401);
    }
    const user = yield prismaClient_1.default.users.findUnique({
        where: { user_id: userId },
        select: {
            user_id: true,
            fullname: true,
            email: true,
            role: true,
        },
    });
    if (!user) {
        throw new asyncHandler_1.CustomError("User not found", 404);
    }
    const admin = yield prismaClient_1.default.admins.findUnique({
        where: { user_id: userId },
    });
    if (!admin) {
        throw new asyncHandler_1.CustomError("Admin profile not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Admin profile fetched successfully",
        user: Object.assign(Object.assign({}, user), { user_id: (0, big_integer_1.default)(user.user_id) }),
        admin: Object.assign(Object.assign({}, admin), { user_id: (0, big_integer_1.default)(admin.user_id), admin_id: (0, big_integer_1.default)(admin.admin_id) }),
    });
}));
//# sourceMappingURL=adminController.js.map