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
exports.updateCitizenProfile = exports.getCitizenProfile = exports.deleteCitizen = exports.registerCitizen = void 0;
const big_integer_1 = __importDefault(require("big-integer"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const hashPassword_1 = require("../utils/hashPassword");
const client_1 = require("@prisma/client");
const validations_1 = require("../utils/validations");
exports.registerCitizen = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validations_1.isValidCitizen)(req.body);
    const { fullname, email, password, role_based_data } = req.body;
    const hashed = yield (0, hashPassword_1.hashPassword)(password);
    const user = yield prismaClient_1.default.users.create({
        data: {
            fullname,
            email,
            password: hashed,
            role: client_1.users_role.Citizen,
        },
    });
    const citizen = yield prismaClient_1.default.citizen.create({
        data: Object.assign({ user_id: user.user_id }, role_based_data),
    });
    res.status(201).json({
        success: true,
        message: "Citizen registered",
        user: Object.assign(Object.assign({}, user), { user_id: (0, big_integer_1.default)(user.user_id) }),
        citizen: Object.assign(Object.assign({}, citizen), { user_id: (0, big_integer_1.default)(user.user_id), citizen_id: (0, big_integer_1.default)(citizen.citizen_id) })
    });
}));
//delete citizen
exports.deleteCitizen = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const existingCitizen = yield prismaClient_1.default.citizen.findUnique({
        where: { user_id: userId },
    });
    if (!existingCitizen) {
        throw new asyncHandler_1.CustomError("Citizen profile not found", 404);
    }
    // Delete citizen record
    yield prismaClient_1.default.citizen.delete({ where: { user_id: userId } });
    // Delete user record
    yield prismaClient_1.default.users.delete({ where: { user_id: userId } });
    // Clear token cookie
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Citizen profile deleted successfully",
    });
}));
//get citizen profile
exports.getCitizenProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const citizen = yield prismaClient_1.default.citizen.findUnique({
        where: { user_id: userId },
    });
    if (!citizen) {
        throw new asyncHandler_1.CustomError("Citizen profile not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Citizen profile fetched successfully",
        user: Object.assign(Object.assign({}, user), { user_id: (0, big_integer_1.default)(user.user_id) }),
        citizen: Object.assign(Object.assign({}, citizen), { user_id: (0, big_integer_1.default)(citizen.user_id), citizen_id: (0, big_integer_1.default)(citizen.citizen_id) })
    });
}));
//update citizen
exports.updateCitizenProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
    if (!userId) {
        throw new asyncHandler_1.CustomError("Unauthorized access", 401);
    }
    yield (0, validations_1.isValidCitizenUpdate)(userId, req.body);
    const { fullname, email, role_based_data } = req.body;
    const existingUser = yield prismaClient_1.default.users.findUnique({ where: { user_id: userId } });
    if (!existingUser)
        throw new asyncHandler_1.CustomError("User not found", 404);
    const existingCitizen = yield prismaClient_1.default.citizen.findUnique({ where: { user_id: userId } });
    if (!existingCitizen)
        throw new asyncHandler_1.CustomError("Citizen profile not found", 404);
    // Update base user fields
    const updatedUser = yield prismaClient_1.default.users.update({
        where: { user_id: userId },
        data: Object.assign(Object.assign({}, (fullname && { fullname })), (email && { email })),
    });
    // Update citizen fields
    const updatedCitizen = yield prismaClient_1.default.citizen.update({
        where: { user_id: userId },
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.adhar_number) && { adhar_number: role_based_data.adhar_number })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.phone_number) && { phone_number: role_based_data.phone_number })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.city) && { city: role_based_data.city })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.state) && { state: role_based_data.state })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.address) && { address: role_based_data.address })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.pincode) && { pincode: role_based_data.pincode })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.latitude) && { latitude: role_based_data.latitude })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.longitude) && { longitude: role_based_data.longitude })),
    });
    res.status(200).json({
        success: true,
        message: "Citizen profile updated successfully",
        user: Object.assign(Object.assign({}, updatedUser), { user_id: (0, big_integer_1.default)(updatedUser.user_id) }),
        citizen: Object.assign(Object.assign({}, updatedCitizen), { citizen_id: (0, big_integer_1.default)(updatedCitizen.citizen_id), user_id: (0, big_integer_1.default)(updatedCitizen.user_id) }),
    });
}));
//# sourceMappingURL=citizenController.js.map