import { Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { loginUser } from "../services/authService";
import { CustomError } from "../middlewares/asyncHandler";
import bigInt from "big-integer";

export const handleLogin = asyncHandler(async (req: any, res: Response) => {
  const { user, token } = await loginUser(req.body);

  if (!user || !token) {
    throw new CustomError("Error in login", 401);
  }

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true, // Security improvement
      secure: process.env.NODE_ENV === "production", // Enable in production
      sameSite: "strict",
    })
    .json({
      message: "Login successful",
      success: true,
      token,
      user: { ...user, user_id: bigInt(user.user_id) },
    });
});

export const handleLogout = asyncHandler(async (req: any, res: Response) => {
  res
    .status(200)
    .clearCookie("token")
    .json({ success: true, message: "Logged out successfully" });
});
