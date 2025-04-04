import prisma from "../utils/prismaClient";
import { RegisterRequest, LoginRequest, CitizenType, AuthorityType } from "../types/userTypes";
import { users_role } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jwtUtils";
import { isValidAuthority, isValidCitizen, isValidUser } from "../utils/validations";
import { CustomError } from "../middlewares/asyncHandler";

export const registerUser = async (data: RegisterRequest) => {
    // Validations for user
    isValidUser(data);

    const { fullname, email, password, role, role_based_data } = data;

    // Check if email already exists
    const foundUser = await prisma.users.findFirst({ where: { email } });
    if (foundUser) {
        throw new CustomError("Email already exists", 409);
    }

    if (role === users_role.Citizen) 
        await isValidCitizen(role_based_data as CitizenType);
    else if(role === users_role.Authority) 
        isValidAuthority(role_based_data as AuthorityType);

    const hashedPassword = await hashPassword(password);

    // Creating User
    const newUser = await prisma.users.create({
        data: {
            fullname,
            email,
            password: hashedPassword,
            role
        }
    });

    // Creation of role-based entries
    if (role === users_role.Citizen) {
        await prisma.citizen.create({
            data: {
                user_id: newUser.user_id,
                ...role_based_data as CitizenType
            }
        });
    } else if (role === users_role.Authority) {
        isValidAuthority(role_based_data as AuthorityType);
        await prisma.authority.create({
            data: {
                user_id: newUser.user_id,
                ...role_based_data as AuthorityType
            }
        });
    } else if (role === users_role.Admin) {
        await prisma.admins.create({
            data: { user_id: newUser.user_id }
        });
    } else {
        throw new CustomError("Invalid role provided", 400);
    }

    return newUser;
};

// For Login
export const loginUser = async (data: LoginRequest) => {
    const { email, password } = data;

    // Validations
    if (!email || !password) throw new CustomError("All fields are required", 400);
    if (email.trim() === "") throw new CustomError("Email can't be empty", 400);
    if (password.trim() === "") throw new CustomError("Password can't be empty", 400);

    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) throw new CustomError("Invalid email or password", 401);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new CustomError("Invalid email or password", 401);

    const token = generateToken(user.user_id, user.role);
    return { token, user };
};
