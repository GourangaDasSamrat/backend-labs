import prisma from "@db";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/apiError";

const secret = process.env.JWT_SECRET;

if (!secret) throw new ApiError(500, "JWT_SECRET is not defined");

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) throw new ApiError(401, "Unauthorized access");

    const decodedToken = jwt.verify(token, secret) as JwtPayload;

    req.user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
    });

    next();
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(500, err.message, [err]);
    }
    throw new ApiError(500, "Something went wrong", [err]);
  }
};
