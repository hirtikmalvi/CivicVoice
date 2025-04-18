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
exports.updateAuthorityProfile = exports.getAuthorityProfile = exports.deleteAuthority = exports.registerAuthority = void 0;
const hashPassword_1 = require("../utils/hashPassword");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const client_1 = require("@prisma/client");
const validations_1 = require("../utils/validations");
const big_integer_1 = __importDefault(require("big-integer"));
exports.registerAuthority = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.isValidAuthority)(req.body);
    const { fullname, email, password, role_based_data } = req.body;
    const hashed = yield (0, hashPassword_1.hashPassword)(password);
    const user = yield prismaClient_1.default.users.create({
        data: {
            fullname,
            email,
            password: hashed,
            role: client_1.users_role.Authority,
        },
    });
    const authority = yield prismaClient_1.default.authority.create({
        data: Object.assign({ user_id: user.user_id }, role_based_data),
    });
    res.status(201).json({
        success: true,
        message: "Authority registered",
        user: Object.assign(Object.assign({}, user), { user_id: (0, big_integer_1.default)(user.user_id) }),
        authority: Object.assign(Object.assign({}, authority), { authority_id: (0, big_integer_1.default)(authority.authority_id), user_id: (0, big_integer_1.default)(user.user_id) })
    });
}));
//delete authority
exports.deleteAuthority = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const existingAuthority = yield prismaClient_1.default.authority.findUnique({
        where: { user_id: userId },
    });
    if (!existingAuthority) {
        throw new asyncHandler_1.CustomError("Authority profile not found", 404);
    }
    // Delete authority record
    yield prismaClient_1.default.authority.delete({ where: { user_id: userId } });
    // Delete user record
    yield prismaClient_1.default.users.delete({ where: { user_id: userId } });
    // Clear token cookie
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Authority profile deleted successfully",
    });
}));
//get authority profile
exports.getAuthorityProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const authority = yield prismaClient_1.default.authority.findUnique({
        where: { user_id: userId },
    });
    if (!authority) {
        throw new asyncHandler_1.CustomError("Authority profile not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Authority profile fetched successfully",
        user: Object.assign(Object.assign({}, user), { user_id: (0, big_integer_1.default)(user.user_id) }),
        admin: Object.assign(Object.assign({}, authority), { user_id: (0, big_integer_1.default)(authority.user_id), authority_id: (0, big_integer_1.default)(authority.authority_id) }),
    });
}));
// update authority
exports.updateAuthorityProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
    if (!userId) {
        throw new asyncHandler_1.CustomError("Unauthorized access", 401);
    }
    // Validate authority update fields
    yield (0, validations_1.isValidAuthorityUpdate)(userId, req.body);
    const { fullname, email, role_based_data } = req.body;
    const existingUser = yield prismaClient_1.default.users.findUnique({ where: { user_id: userId } });
    if (!existingUser)
        throw new asyncHandler_1.CustomError("User not found", 404);
    const existingAuthority = yield prismaClient_1.default.authority.findUnique({ where: { user_id: userId } });
    if (!existingAuthority)
        throw new asyncHandler_1.CustomError("Authority profile not found", 404);
    // Update user fields
    const updatedUser = yield prismaClient_1.default.users.update({
        where: { user_id: userId },
        data: Object.assign(Object.assign({}, (fullname && { fullname })), (email && { email })),
    });
    // Update authority-specific fields
    const updatedAuthority = yield prismaClient_1.default.authority.update({
        where: { user_id: userId },
        data: Object.assign(Object.assign({}, ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.zone) && { zone: role_based_data.zone })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.department) && { department: role_based_data.department })),
    });
    res.status(200).json({
        success: true,
        message: "Authority profile updated successfully",
        user: Object.assign(Object.assign({}, updatedUser), { user_id: (0, big_integer_1.default)(updatedUser.user_id) }),
        authority: Object.assign(Object.assign({}, updatedAuthority), { authority_id: (0, big_integer_1.default)(updatedAuthority.authority_id), user_id: (0, big_integer_1.default)(updatedAuthority.user_id) }),
    });
}));
//# sourceMappingURL=authorityController.js.map