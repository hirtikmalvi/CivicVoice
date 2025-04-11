import jwt from "jsonwebtoken";
import { CustomError } from "../middlewares/asyncHandler"; 
import bigInt from "big-integer";

const JWT_SECRET = process.env.SECRET_KEY;
if (!JWT_SECRET) {
    throw new Error("JWT Secret is missing! Set SECRET_KEY in environment variables.");
}

export const generateToken = (uid: bigint, role: string): string => {
    try {
        let userId = bigInt(uid);
        return jwt.sign({ user_id: userId, role }, JWT_SECRET, { expiresIn: "7d" });
    } catch (error) {
        throw new CustomError("Error generating JWT token", 500);
    }
};




