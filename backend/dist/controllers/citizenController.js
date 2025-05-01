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
exports.getCitizenIdByUserId = exports.updateCitizenProfile = exports.getCitizenByUserId = exports.getCitizenById = exports.getCitizenProfile = exports.deleteCitizen = exports.registerCitizen = void 0;
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
        citizen: Object.assign(Object.assign({}, citizen), { user_id: (0, big_integer_1.default)(user.user_id), citizen_id: (0, big_integer_1.default)(citizen.citizen_id) }),
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
        where: { user_id: userId },
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
        citizen: Object.assign(Object.assign({}, citizen), { user_id: (0, big_integer_1.default)(citizen.user_id), citizen_id: (0, big_integer_1.default)(citizen.citizen_id) }),
    });
}));
// Get Citizen By Id
exports.getCitizenById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const citizen_id = req.params.citizen_id;
    if (!citizen_id) {
        throw new asyncHandler_1.CustomError("Citizen ID is required", 400);
    }
    const citizen = yield prismaClient_1.default.citizen.findUnique({
        where: { citizen_id: BigInt(citizen_id) },
        include: {
            users: true,
        },
    });
    if (!citizen) {
        throw new asyncHandler_1.CustomError("Citizen not found", 404);
    }
    res.status(200).json({
        message: "Citizen fetched successfully",
        citizen: {
            citizen_id: (0, big_integer_1.default)(citizen.citizen_id),
            user_id: (0, big_integer_1.default)(citizen.user_id),
            adhar_number: citizen.adhar_number,
            phone_number: citizen.phone_number,
            city: citizen.city,
            state: citizen.state,
            pincode: citizen.pincode,
            address: citizen.address,
            latitude: citizen.latitude,
            longitude: citizen.longitude,
            created_at: citizen.created_at,
            updated_at: citizen.updated_at,
            fullname: citizen.users.fullname,
            email: citizen.users.email,
            role: citizen.users.role,
            user_created_at: citizen.users.created_at,
            user_updated_at: citizen.users.updated_at,
        },
        // users: {...citizen.users, user_id: bigInt(citizen.users.user_id)}
    });
}));
// Get Citizen from user_id.
exports.getCitizenByUserId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.user_id;
    if (!userId) {
        throw new asyncHandler_1.CustomError("User ID is required", 400);
    }
    const citizen = yield prismaClient_1.default.citizen.findUnique({
        where: {
            user_id: BigInt(userId),
        },
        include: {
            users: true,
        },
    });
    if (!citizen) {
        throw new asyncHandler_1.CustomError("Citizen not found for given user ID", 404);
    }
    res.status(200).json({
        message: "Citizen fetched successfully",
        citizen: {
            citizen_id: (0, big_integer_1.default)(citizen.citizen_id),
            user_id: (0, big_integer_1.default)(citizen.user_id),
            adhar_number: citizen.adhar_number,
            phone_number: citizen.phone_number,
            city: citizen.city,
            state: citizen.state,
            pincode: citizen.pincode,
            address: citizen.address,
            latitude: citizen.latitude,
            longitude: citizen.longitude,
            created_at: citizen.created_at,
            updated_at: citizen.updated_at,
            fullname: citizen.users.fullname,
            email: citizen.users.email,
            role: citizen.users.role,
            user_created_at: citizen.users.created_at,
            user_updated_at: citizen.users.updated_at,
        },
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
    const existingUser = yield prismaClient_1.default.users.findUnique({
        where: { user_id: userId },
    });
    if (!existingUser)
        throw new asyncHandler_1.CustomError("User not found", 404);
    const existingCitizen = yield prismaClient_1.default.citizen.findUnique({
        where: { user_id: userId },
    });
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
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.adhar_number) && {
            adhar_number: role_based_data.adhar_number,
        })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.phone_number) && {
            phone_number: role_based_data.phone_number,
        })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.city) && { city: role_based_data.city })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.state) && { state: role_based_data.state })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.address) && { address: role_based_data.address })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.pincode) && { pincode: role_based_data.pincode })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.latitude) && {
            latitude: role_based_data.latitude,
        })), ((role_based_data === null || role_based_data === void 0 ? void 0 : role_based_data.longitude) && {
            longitude: role_based_data.longitude,
        })),
    });
    res.status(200).json({
        success: true,
        message: "Citizen profile updated successfully",
        user: Object.assign(Object.assign({}, updatedUser), { user_id: (0, big_integer_1.default)(updatedUser.user_id) }),
        citizen: Object.assign(Object.assign({}, updatedCitizen), { citizen_id: (0, big_integer_1.default)(updatedCitizen.citizen_id), user_id: (0, big_integer_1.default)(updatedCitizen.user_id) }),
    });
}));
//helper function to get citizen_id by user_id
const getCitizenIdByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const citizen = yield prismaClient_1.default.citizen.findUnique({
        where: {
            user_id: BigInt(userId),
        },
        select: {
            citizen_id: true,
        },
    });
    if (!citizen) {
        throw new asyncHandler_1.CustomError('Citizen not found for the given user_id', 404);
    }
    return (0, big_integer_1.default)(citizen.citizen_id);
});
exports.getCitizenIdByUserId = getCitizenIdByUserId;
//# sourceMappingURL=citizenController.js.map