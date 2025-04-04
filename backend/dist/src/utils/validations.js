"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAuthority = exports.isValidCitizen = exports.isValidUser = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../middlewares/asyncHandler");
// Validations for user
const isValidUser = (data) => {
    const { fullname, email, password, role, role_based_data } = data;
    if (!fullname || !email || !password || !role) {
        throw new asyncHandler_1.CustomError("All fields are required for user registration", 400);
    }
    if ((client_1.users_role.Authority == role || client_1.users_role.Citizen == role) && !role_based_data) {
        throw new asyncHandler_1.CustomError("Role-based data is required", 400);
    }
    if (!Object.values(client_1.users_role).includes(role)) {
        throw new asyncHandler_1.CustomError("Invalid role provided", 400);
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
};
exports.isValidUser = isValidUser;
// Validations for citizen
const isValidCitizen = (data) => {
    const { adhar_number, phone_number, city, state, address, pincode, latitude, longitude } = data;
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
};
exports.isValidCitizen = isValidCitizen;
// Validations for authority
const isValidAuthority = (data) => {
    const { zone, department } = data;
    if (!zone || !department) {
        throw new asyncHandler_1.CustomError("Zone and department are required", 400);
    }
};
exports.isValidAuthority = isValidAuthority;
//# sourceMappingURL=validations.js.map