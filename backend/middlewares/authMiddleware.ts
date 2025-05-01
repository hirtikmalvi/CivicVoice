import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "./asyncHandler"; // or wherever your CustomError is
import prisma from "../utils/prismaClient";
import bigInt from "big-integer";

interface JwtPayload {
  user_id: string;
}

export const isAuthenticated = async (
  req,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    console.log("req.cookies.token: ", req.cookies.token);

    if (!token) {
      throw new CustomError("Not authenticated. Please login.", 401);
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;

    const user = await prisma.users.findUnique({
      where: { user_id: BigInt(decoded.user_id) },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    req.user = user; //  Attach user to request
    next();
  } catch (error: any) {
    const message =
      error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"
        ? "Invalid or expired token"
        : error.message;
    res.status(401).json({ message, statusCode: 401 });
  }
};
