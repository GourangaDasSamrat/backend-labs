import { User } from "@/types/prisma";
import prisma from "@db";
import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { cookieToken } from "../utils/cookieToken";

// user sign up
export const handleUserSignUp = async (req: Request, res: Response) => {
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
    cookieToken(user, res);
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(500, err.message, [err]);
    }
    throw new ApiError(500, "Something went wrong", [err]);
  }
};

// user sign in
export const handleUserSignIn = async (req: Request, res: Response) => {
  try {
    // extract data from request body
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "All fields required");
    }

    // find user on db
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // if user not exist
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // if password not matched
    if (user.password !== password) {
      throw new ApiError(400, "Invalid password");
    }

    // send user cookie
    cookieToken(user, res);
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(500, err.message, [err]);
    }
    throw new ApiError(500, "Something went wrong", [err]);
  }
};

// user sign out
export const handleUserSignOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token").status(200).json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(500, err.message, [err]);
    }
    throw new ApiError(500, "Something went wrong", [err]);
  }
};
