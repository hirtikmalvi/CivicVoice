import prisma from "../utils/prismaClient";
import {  LoginRequest } from "../types/userTypes";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jwtUtils";
import { CustomError } from "../middlewares/asyncHandler";

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
