import bcrypt from "bcryptjs";
import { CustomError } from "../middlewares/asyncHandler";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error("Error while hashing password:", error);
        throw new CustomError("Error hashing password", 500);
    }
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error("Error while comparing password:", error);
        throw new CustomError("Error comparing password", 500);
    }
};
