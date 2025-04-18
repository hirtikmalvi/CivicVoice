import { users_role } from "@prisma/client";
import { AuthorityRegisterRequest, AuthorityType, CitizenRegisterRequest, CitizenType } from "../types/userTypes";
import { CustomError } from "../middlewares/asyncHandler";
import { department_type } from "@prisma/client";
import prisma from "./prismaClient";

// Validations for user
export const isValidUser = async (fullname: string, email: string, password: string): Promise<void> => {

    if (!fullname || !email || !password) {
        throw new CustomError("All fields are required for user registration", 400);
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

    const exists = await prisma.users.findUnique({ where: { email } });
    if (exists) throw new CustomError("Email already registered", 409);
};

// Validations for citizen
export const isValidCitizen = async (data: CitizenRegisterRequest): Promise<void> => {

    const { fullname, email, password, role_based_data } = data;

    if (!role_based_data) throw new CustomError("Role based data not found", 404);

    await isValidUser(fullname, email, password);

    const { adhar_number, phone_number, city, state, address, pincode, latitude, longitude } = role_based_data;

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
    // Check if adhar_number already exists
    const foundAdhar = await prisma.citizen.findFirst({ where: { adhar_number } });
    if (foundAdhar) {
        throw new CustomError("Adhar number already exists", 409);
    }
};

// Validations for authority
export const isValidAuthority = async (data: AuthorityRegisterRequest): Promise<void> => {

    const { fullname, email, password, role_based_data } = data;

    if (!role_based_data) throw new CustomError("Role based data not found", 404);

    await isValidUser(fullname, email, password);

    const { zone, department } = role_based_data;

    if (!zone || !department) {
        throw new CustomError("Zone and department are required", 400);
    }

    if (!["zone1", "zone2", "zone3", "zone4"].includes(zone))
        throw new CustomError("Unknown zone provided", 404);

    // Check if department value is in enum
    const validDepartments = Object.values(department_type);
    if (!validDepartments.includes(department as department_type)) {
        throw new CustomError("Invalid department provided", 400);
    }
};


//validation for citizen update


export const isValidCitizenUpdate = async (userId: number, data: Partial<CitizenRegisterRequest>): Promise<void> => {
    const { fullname, email, role_based_data } = data;

    // Basic email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new CustomError("Invalid email format", 400);
    }

    const {
        adhar_number,
        phone_number,
        city,
        state,
        address,
        pincode,
    } = role_based_data || {};

    const adharRegEx = /^[2-9][0-9]{11}$/;
    const phoneNumberRegEx = /^[6-9][0-9]{9}$/;
    const pincodeRegEX = /^[1-9][0-9]{5}$/;

    //  Aadhaar check
    if (adhar_number) {
        if (!adharRegEx.test(adhar_number)) {
            throw new CustomError("Invalid Aadhaar number format", 400);
        }
        const foundAdhar = await prisma.citizen.findFirst({
            where: {
                adhar_number,
                NOT: { user_id: userId },
            },
        });
        if (foundAdhar) {
            throw new CustomError("Aadhaar number already exists", 409);
        }
    }

    //  Phone check
    if (phone_number) {
        if (!phoneNumberRegEx.test(phone_number)) {
            throw new CustomError("Invalid phone number format", 400);
        }
        const foundPhone = await prisma.citizen.findFirst({
            where: {
                phone_number,
                NOT: { user_id: userId },
            },
        });
        if (foundPhone) {
            throw new CustomError("Phone number already exists", 409);
        }
    }

    //  Pincode check
    if (pincode && !pincodeRegEX.test(pincode)) {
        throw new CustomError("Invalid pincode format", 400);
    }

    // Non-empty text fields
    const stringFields = { city, state, address };
    for (const [field, value] of Object.entries(stringFields)) {
        if (value !== undefined && value.trim() === "") {
            throw new CustomError(`${field} cannot be empty`, 400);
        }
    }
};

//update authority validation

export const isValidAuthorityUpdate = async (
  userId: number,
  data: Partial<AuthorityRegisterRequest>
): Promise<void> => {
  const { fullname, email, role_based_data } = data;

  // Basic email format validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new CustomError("Invalid email format", 400);
  }

  if (!role_based_data) throw new CustomError("Role-based data not found", 404);

  const { zone, department } = role_based_data;

  // Zone and department validation
  if (!zone || !department) {
    throw new CustomError("Zone and department are required", 400);
  }

  const validZones = ["zone1", "zone2", "zone3", "zone4"];
  if (!validZones.includes(zone)) {
    throw new CustomError("Unknown zone provided", 404);
  }

  // Check if department is valid
  const validDepartments = Object.values(department_type);
  if (!validDepartments.includes(department as department_type)) {
    throw new CustomError("Invalid department provided", 400);
  }

  // Non-empty text fields (zone, department)
  const stringFields = { zone, department };
  for (const [field, value] of Object.entries(stringFields)) {
    if (value !== undefined && value.trim() === "") {
      throw new CustomError(`${field} cannot be empty`, 400);
    }
  }
};
