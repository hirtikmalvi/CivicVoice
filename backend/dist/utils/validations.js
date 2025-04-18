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
exports.isValidAuthorityUpdate = exports.isValidCitizenUpdate = exports.isValidAuthority = exports.isValidCitizen = exports.isValidUser = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const client_1 = require("@prisma/client");
const prismaClient_1 = __importDefault(require("./prismaClient"));
// Validations for user
const isValidUser = (fullname, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fullname || !email || !password) {
        throw new asyncHandler_1.CustomError("All fields are required for user registration", 400);
    }
    if (typeof fullname === "string" && fullname.trim() === "") {
        throw new asyncHandler_1.CustomError("Full name cannot be empty", 400);
    }
    if (typeof email === "string" && email.trim() === "") {
        throw new asyncHandler_1.CustomError("Email cannot be empty", 400);
    }
    if (typeof password === "string" && password.trim() === "") {
        throw new asyncHandler_1.CustomError("Password cannot be empty", 400);
    }
    if (password.length <= 6) {
        throw new asyncHandler_1.CustomError("Password must be at least 7 characters long", 400);
    }
    // Email format validation (Optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new asyncHandler_1.CustomError("Invalid email format", 400);
    }
    const exists = yield prismaClient_1.default.users.findUnique({ where: { email } });
    if (exists)
        throw new asyncHandler_1.CustomError("Email already registered", 409);
});
exports.isValidUser = isValidUser;
// Validations for citizen
const isValidCitizen = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, role_based_data } = data;
    if (!role_based_data)
        throw new asyncHandler_1.CustomError("Role based data not found", 404);
    yield (0, exports.isValidUser)(fullname, email, password);
    const { adhar_number, phone_number, city, state, address, pincode, latitude, longitude } = role_based_data;
    const requiredFields = {
        adhar_number,
        phone_number,
        city,
        state,
        address,
        pincode
    };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === "") {
            throw new asyncHandler_1.CustomError(`${key.replace("_", " ")} is required`, 400);
        }
    }
    // Aadhar, phone, and pincode validation
    const adharRegEx = /^[2-9][0-9]{11}$/;
    const phoneNumberRegEx = /^[6-9][0-9]{9}$/;
    const pincodeRegEX = /^[1-9][0-9]{5}$/;
    if (!adharRegEx.test(adhar_number)) {
        throw new asyncHandler_1.CustomError("Invalid Aadhaar number format", 400);
    }
    if (!phoneNumberRegEx.test(phone_number)) {
        throw new asyncHandler_1.CustomError("Invalid phone number format", 400);
    }
    if (!pincodeRegEX.test(pincode)) {
        throw new asyncHandler_1.CustomError("Invalid pincode format", 400);
    }
    // Check if phone_number already exists
    const foundPhone = yield prismaClient_1.default.citizen.findFirst({ where: { phone_number } });
    if (foundPhone) {
        throw new asyncHandler_1.CustomError("Phone number already exists", 409);
    }
    // Check if adhar_number already exists
    const foundAdhar = yield prismaClient_1.default.citizen.findFirst({ where: { adhar_number } });
    if (foundAdhar) {
        throw new asyncHandler_1.CustomError("Adhar number already exists", 409);
    }
});
exports.isValidCitizen = isValidCitizen;
// Validations for authority
const isValidAuthority = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, role_based_data } = data;
    if (!role_based_data)
        throw new asyncHandler_1.CustomError("Role based data not found", 404);
    yield (0, exports.isValidUser)(fullname, email, password);
    const { zone, department } = role_based_data;
    if (!zone || !department) {
        throw new asyncHandler_1.CustomError("Zone and department are required", 400);
    }
    if (!["zone1", "zone2", "zone3", "zone4"].includes(zone))
        throw new asyncHandler_1.CustomError("Unknown zone provided", 404);
    // Check if department value is in enum
    const validDepartments = Object.values(client_1.department_type);
    if (!validDepartments.includes(department)) {
        throw new asyncHandler_1.CustomError("Invalid department provided", 400);
    }
});
exports.isValidAuthority = isValidAuthority;
//validation for citizen update
const isValidCitizenUpdate = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, role_based_data } = data;
    // Basic email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new asyncHandler_1.CustomError("Invalid email format", 400);
    }
    const { adhar_number, phone_number, city, state, address, pincode, } = role_based_data || {};
    const adharRegEx = /^[2-9][0-9]{11}$/;
    const phoneNumberRegEx = /^[6-9][0-9]{9}$/;
    const pincodeRegEX = /^[1-9][0-9]{5}$/;
    //  Aadhaar check
    if (adhar_number) {
        if (!adharRegEx.test(adhar_number)) {
            throw new asyncHandler_1.CustomError("Invalid Aadhaar number format", 400);
        }
        const foundAdhar = yield prismaClient_1.default.citizen.findFirst({
            where: {
                adhar_number,
                NOT: { user_id: userId },
            },
        });
        if (foundAdhar) {
            throw new asyncHandler_1.CustomError("Aadhaar number already exists", 409);
        }
    }
    //  Phone check
    if (phone_number) {
        if (!phoneNumberRegEx.test(phone_number)) {
            throw new asyncHandler_1.CustomError("Invalid phone number format", 400);
        }
        const foundPhone = yield prismaClient_1.default.citizen.findFirst({
            where: {
                phone_number,
                NOT: { user_id: userId },
            },
        });
        if (foundPhone) {
            throw new asyncHandler_1.CustomError("Phone number already exists", 409);
        }
    }
    //  Pincode check
    if (pincode && !pincodeRegEX.test(pincode)) {
        throw new asyncHandler_1.CustomError("Invalid pincode format", 400);
    }
    // Non-empty text fields
    const stringFields = { city, state, address };
    for (const [field, value] of Object.entries(stringFields)) {
        if (value !== undefined && value.trim() === "") {
            throw new asyncHandler_1.CustomError(`${field} cannot be empty`, 400);
        }
    }
});
exports.isValidCitizenUpdate = isValidCitizenUpdate;
//update authority validation
const isValidAuthorityUpdate = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, role_based_data } = data;
    // Basic email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new asyncHandler_1.CustomError("Invalid email format", 400);
    }
    if (!role_based_data)
        throw new asyncHandler_1.CustomError("Role-based data not found", 404);
    const { zone, department } = role_based_data;
    // Zone and department validation
    if (!zone || !department) {
        throw new asyncHandler_1.CustomError("Zone and department are required", 400);
    }
    const validZones = ["zone1", "zone2", "zone3", "zone4"];
    if (!validZones.includes(zone)) {
        throw new asyncHandler_1.CustomError("Unknown zone provided", 404);
    }
    // Check if department is valid
    const validDepartments = Object.values(client_1.department_type);
    if (!validDepartments.includes(department)) {
        throw new asyncHandler_1.CustomError("Invalid department provided", 400);
    }
    // Non-empty text fields (zone, department)
    const stringFields = { zone, department };
    for (const [field, value] of Object.entries(stringFields)) {
        if (value !== undefined && value.trim() === "") {
            throw new asyncHandler_1.CustomError(`${field} cannot be empty`, 400);
        }
    }
});
exports.isValidAuthorityUpdate = isValidAuthorityUpdate;
//# sourceMappingURL=validations.js.map