import { ApiError } from "@/utils/apiError";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? [],
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};