import bigInt from "big-integer";
import { loginUser, registerUser } from "../services/authService";
import { Request, Response } from "express";
import { asyncHandler, CustomError } from "../middlewares/asyncHandler";


export const handleRegistration = asyncHandler(async (req: Request, res: Response) => {
    const newUser = await registerUser(req.body);

    if (!newUser) {
        throw new CustomError("User registration failed", 500);
    }

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: { ...newUser, user_id: bigInt(newUser.user_id) }
    });
});

export const handleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await loginUser(req.body);

    if (!user || !token) {
        throw new CustomError("Invalid email or password", 401);
    }

    res.status(200)
        .cookie("token", token, { 
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
            httpOnly: true,  // Security improvement
            secure: process.env.NODE_ENV === "production",  // Enable in production
            sameSite: "strict"
        })
        .json({
            message: "Login successful",
            success: true,
            token,
            user: { ...user, user_id: bigInt(user.user_id) }
        });
});
