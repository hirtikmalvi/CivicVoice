import { Request, Response, NextFunction } from "express";
import { CustomError } from "./asyncHandler";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; 

  if (!user) {
    throw new CustomError("Not authenticated", 401);
  }

  if (user.role !== "admin") {
    throw new CustomError("Access denied: Admins only", 403);
  }
  next();
};
