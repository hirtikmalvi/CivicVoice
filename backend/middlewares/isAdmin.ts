import { Request, Response, NextFunction } from "express";
import { asyncHandler, CustomError } from "./asyncHandler";

export const isAdmin = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; 

  if (!user) {
    throw new CustomError("Not authenticated", 401);
  }

  if (user.role !== "Admin") {
    throw new CustomError("Access denied: Admins only", 403);
  }
  next();
});
