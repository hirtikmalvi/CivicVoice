import { Request, Response, NextFunction } from "express";

// A custom error type to include statusCode
class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Async Handler
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((error) => {
        const statusCode = error instanceof CustomError ? error.statusCode : 500;

        res.status(statusCode).json({
          message: error.message || "Internal Server Error",
          statusCode,
        });
      });
    };

export { asyncHandler, CustomError };