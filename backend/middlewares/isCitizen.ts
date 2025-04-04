import { Request, Response, NextFunction } from "express";
import { CustomError } from "./asyncHandler";

export const isCitizen = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; 
  
  if (!user) {
    throw new CustomError("Not authenticated", 401);
  }

  if (user.role !== "Citizen") {
    throw new CustomError("Access denied: Citizens only", 403);
  }

  next();
};
