import { User } from "@/types/prisma";
import prisma from "@db";
import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { cookieToken } from '../utils/cookieToken';

// user sign up
export const handleUserSignUp = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // extract data from request body
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new ApiError(400, "All fields required");
      }

      // sign up
      const user: User = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      // send user cookie
      cookieToken(user,res)

    } catch (err) {
      if (err instanceof Error) {
        throw new ApiError(500, err.message, [err]);
      }
      throw new ApiError(500, "Something went wrong", [err]);
    }
  },
);
