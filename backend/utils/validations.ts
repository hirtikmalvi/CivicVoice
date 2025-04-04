    import { users_role } from "@prisma/client";
    import { AuthorityType, CitizenType, RegisterRequest } from "../types/userTypes";
    import { CustomError } from "../middlewares/asyncHandler";
    import { department_type } from "@prisma/client";
    import prisma from "./prismaClient";

    // Validations for user
    export const isValidUser = (data: RegisterRequest): void => {
        const { fullname, email, password, role, role_based_data } = data;

        if (!fullname || !email || !password || !role) {
            throw new CustomError("All fields are required for user registration", 400);
        }

        if((users_role.Authority == role || users_role.Citizen == role) && !role_based_data) {
            throw new CustomError("Role-based data is required", 400);
        }

        if (!Object.values(users_role).includes(role)) {
            throw new CustomError("Invalid role provided", 400);
        }

        if (typeof fullname === "string" && fullname.trim() === "") {
            throw new CustomError("Full name cannot be empty", 400);
        }

        if (typeof email === "string" && email.trim() === "") {
            throw new CustomError("Email cannot be empty", 400);
        }

        if (typeof password === "string" && password.trim() === "") {
            throw new CustomError("Password cannot be empty", 400);
        }

        if (password.length <= 6) {
            throw new CustomError("Password must be at least 7 characters long", 400);
        }

        // Email format validation (Optional)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new CustomError("Invalid email format", 400);
        }
    };

    // Validations for citizen
    export const isValidCitizen = async (data: CitizenType): Promise<void> => {
        const { adhar_number, phone_number, city, state, address, pincode, latitude, longitude } = data;

        const requiredFields: { [key: string]: string } = {
            adhar_number,
            phone_number,
            city,
            state,
            address,
            pincode
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || value.trim() === "") {
                throw new CustomError(`${key.replace("_", " ")} is required`, 400);
            }
        }

        // Aadhar, phone, and pincode validation
        const adharRegEx = /^[2-9][0-9]{11}$/;
        const phoneNumberRegEx = /^[6-9][0-9]{9}$/;
        const pincodeRegEX = /^[1-9][0-9]{5}$/;

        if (!adharRegEx.test(adhar_number)) {
            throw new CustomError("Invalid Aadhaar number format", 400);
        }
        if (!phoneNumberRegEx.test(phone_number)) {
            throw new CustomError("Invalid phone number format", 400);
        }
        if (!pincodeRegEX.test(pincode)) {
            throw new CustomError("Invalid pincode format", 400);
        }
        // Check if phone_number already exists
        const foundPhone = await prisma.citizen.findFirst({ where: { phone_number } });
        if (foundPhone) {
            throw new CustomError("Phone number already exists", 409);
        }
    };

    // Validations for authority
    export const isValidAuthority = (data: AuthorityType): void => {
        const { zone, department } = data;

        if (!zone || !department) {
            throw new CustomError("Zone and department are required", 400);
        }

        if(!["zone1", "zone2", "zone3", "zone4"].includes(zone))
            throw new CustomError("Unknown zone provided", 404);

        // Check if department value is in enum
        const validDepartments = Object.values(department_type);
        if (!validDepartments.includes(department as department_type)) {
            throw new CustomError("Invalid department provided", 400);
        }
    };
