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
exports.getAdminByUserId = exports.deleteUserByUserId = exports.deleteAuthorityByAuthorityId = exports.deleteCitizenByUserId = exports.deleteCitizenByCitizenId = exports.getAdminProfile = exports.getAllUsers = exports.getAllAuthorities = exports.getAllCitizens = exports.deleteAdmin = exports.registerAdmin = void 0;
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
        admin: Object.assign(Object.assign({}, admin), { user_id: (0, big_integer_1.default)(admin.user_id), admin_id: (0, big_integer_1.default)(admin.admin_id) }),
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
        where: { user_id: userId },
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
// get all citizens
exports.getAllCitizens = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const citizens = yield prismaClient_1.default.citizen.findMany({
        include: {
            users: true,
        },
    });
    if (!citizens || citizens.length === 0) {
        throw new asyncHandler_1.CustomError("No citizens found", 404);
    }
    const formattedCitizens = citizens.map((citizen) => {
        var _a, _b, _c, _d, _e;
        return ({
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
            fullname: (_a = citizen.users) === null || _a === void 0 ? void 0 : _a.fullname,
            email: (_b = citizen.users) === null || _b === void 0 ? void 0 : _b.email,
            role: (_c = citizen.users) === null || _c === void 0 ? void 0 : _c.role,
            user_created_at: (_d = citizen.users) === null || _d === void 0 ? void 0 : _d.created_at,
            user_updated_at: (_e = citizen.users) === null || _e === void 0 ? void 0 : _e.updated_at,
        });
    });
    res.status(200).json({
        success: true,
        count: formattedCitizens.length,
        citizens: formattedCitizens,
    });
}));
// get all authorities
exports.getAllAuthorities = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorities = yield prismaClient_1.default.authority.findMany({
        include: {
            users: true,
        },
    });
    if (!authorities || authorities.length === 0) {
        throw new asyncHandler_1.CustomError("No authorities found", 404);
    }
    const formattedAuthorities = authorities.map((authority) => {
        var _a, _b, _c, _d, _e;
        return ({
            authority_id: (0, big_integer_1.default)(authority.authority_id),
            user_id: (0, big_integer_1.default)(authority.user_id),
            zone: authority.zone,
            department: authority.department,
            created_at: authority.created_at,
            updated_at: authority.updated_at,
            fullname: (_a = authority.users) === null || _a === void 0 ? void 0 : _a.fullname,
            email: (_b = authority.users) === null || _b === void 0 ? void 0 : _b.email,
            role: (_c = authority.users) === null || _c === void 0 ? void 0 : _c.role,
            user_created_at: (_d = authority.users) === null || _d === void 0 ? void 0 : _d.created_at,
            user_updated_at: (_e = authority.users) === null || _e === void 0 ? void 0 : _e.updated_at,
        });
    });
    res.status(200).json({
        success: true,
        count: formattedAuthorities.length,
        authorities: formattedAuthorities,
    });
}));
// get all users
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaClient_1.default.users.findMany({});
    if (!users || users.length === 0) {
        throw new asyncHandler_1.CustomError("No citizens found", 404);
    }
    const formattedUsers = users.map((user) => ({
        user_id: (0, big_integer_1.default)(user.user_id),
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    }));
    res.status(200).json({
        success: true,
        count: formattedUsers.length,
        users: formattedUsers,
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
// DELETE /api/citizen/by-citizen-id/:citizen_id
exports.deleteCitizenByCitizenId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { citizen_id } = req.params;
    if (!citizen_id) {
        throw new asyncHandler_1.CustomError("Citizen ID is required", 400);
    }
    const citizen = yield prismaClient_1.default.citizen.findUnique({
        where: { citizen_id: BigInt(citizen_id) },
    });
    if (!citizen) {
        throw new asyncHandler_1.CustomError("Citizen not found", 404);
    }
    const user_id = citizen.user_id;
    // Delete citizen
    yield prismaClient_1.default.citizen.delete({ where: { citizen_id: BigInt(citizen_id) } });
    // Delete user if exists
    yield prismaClient_1.default.users.delete({ where: { user_id } });
    res.status(200).json({
        success: true,
        message: "Citizen and associated user deleted successfully",
    });
}));
// DELETE /api/admin/by-user-id/:user_id
exports.deleteCitizenByUserId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    if (!user_id) {
        throw new asyncHandler_1.CustomError("User ID is required", 400);
    }
    const citizen = yield prismaClient_1.default.citizen.findUnique({
        where: { user_id: BigInt(user_id) },
    });
    if (!citizen) {
        throw new asyncHandler_1.CustomError("Citizen not found", 404);
    }
    // Delete citizen
    yield prismaClient_1.default.citizen.delete({ where: { user_id: BigInt(user_id) } });
    // Delete user
    yield prismaClient_1.default.users.delete({ where: { user_id: BigInt(user_id) } });
    res.status(200).json({
        success: true,
        message: "Citizen and associated user deleted successfully",
    });
}));
// DELETE /api/admin/by-authority-id/:authority_id
exports.deleteAuthorityByAuthorityId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authority_id } = req.params;
    if (!authority_id) {
        throw new asyncHandler_1.CustomError("Authority ID is required", 400);
    }
    const authority = yield prismaClient_1.default.authority.findUnique({
        where: { authority_id: BigInt(authority_id) },
    });
    if (!authority) {
        throw new asyncHandler_1.CustomError("Authority not found", 404);
    }
    const user_id = authority.user_id;
    // Delete citizen
    yield prismaClient_1.default.authority.delete({ where: { authority_id: BigInt(authority_id) } });
    // Delete user if exists
    yield prismaClient_1.default.users.delete({ where: { user_id } });
    res.status(200).json({
        success: true,
        message: "Authority and associated user deleted successfully",
    });
}));
//delete user
exports.deleteUserByUserId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    if (!user_id) {
        throw new asyncHandler_1.CustomError("User ID is required", 400);
    }
    const user = yield prismaClient_1.default.users.findUnique({
        where: { user_id: BigInt(user_id) },
    });
    if (!user) {
        throw new asyncHandler_1.CustomError("User not found", 404);
    }
    if (user.role == "Admin") {
        const admin = yield prismaClient_1.default.admins.findUnique({
            where: { user_id: BigInt(user_id) },
        });
        if (!admin) {
            throw new asyncHandler_1.CustomError("Admin not found", 404);
        }
        yield prismaClient_1.default.admins.delete({
            where: { admin_id: admin.admin_id }
        });
        yield prismaClient_1.default.users.delete({
            where: { user_id: BigInt(user_id) },
        });
    }
    else if (user.role == "Citizen") {
        const citizen = yield prismaClient_1.default.citizen.findUnique({
            where: { user_id: BigInt(user_id) },
        });
        if (!citizen) {
            throw new asyncHandler_1.CustomError("Citizen not found", 404);
        }
        yield prismaClient_1.default.citizen.delete({
            where: { citizen_id: citizen.citizen_id }
        });
        yield prismaClient_1.default.users.delete({
            where: { user_id: BigInt(user_id) },
        });
    }
    else if (user.role == "Authority") {
        const authority = yield prismaClient_1.default.authority.findUnique({
            where: { user_id: BigInt(user_id) },
        });
        if (!authority) {
            throw new asyncHandler_1.CustomError("Authority not found", 404);
        }
        yield prismaClient_1.default.authority.delete({
            where: { authority_id: authority.authority_id }
        });
        yield prismaClient_1.default.users.delete({
            where: { user_id: BigInt(user_id) },
        });
    }
    else {
        throw new asyncHandler_1.CustomError("No role match for deletion");
    }
    res.status(200).json({ message: `User with ID ${user_id} deleted successfully` });
}));
//get Authority by user_id
//authority by id
exports.getAdminByUserId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.user_id;
    if (!user_id) {
        throw new asyncHandler_1.CustomError("User ID is required", 400);
    }
    const admin = yield prismaClient_1.default.admins.findUnique({
        where: { user_id: BigInt(user_id) },
        include: {
            users: true,
        },
    });
    if (!admin) {
        throw new asyncHandler_1.CustomError("admin not found", 404);
    }
    res.status(200).json({
        message: "admin fetched successfully",
        admin: {
            admin_id: (0, big_integer_1.default)(admin.admin_id),
            user_id: (0, big_integer_1.default)(admin.user_id),
            fullname: admin.users.fullname,
            email: admin.users.email,
            role: admin.users.role,
            created_at: admin.created_at,
            updated_at: admin.updated_at,
            user_created_at: admin.users.created_at,
            user_updated_at: admin.users.updated_at
        },
    });
}));
//# sourceMappingURL=adminController.js.map