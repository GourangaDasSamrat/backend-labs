import { User } from "@/types/prisma";
import { ApiError } from "@/utils/apiError";
import { cookieToken } from "@/utils/cookieToken";
import prisma from "@db";
import { Request, Response } from "express";

// user sign up
export const handleUserSignUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields required");
  }

  const user: User = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  cookieToken(user, res);
};

// user sign in
export const handleUserSignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.password !== password) {
    throw new ApiError(400, "Invalid password");
  }

  cookieToken(user, res);
};

// user sign out
export const handleUserSignOut = async (req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({
    success: true,
  });
};
