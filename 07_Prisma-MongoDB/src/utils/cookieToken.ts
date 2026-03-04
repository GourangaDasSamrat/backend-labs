import { User } from "@/types/prisma";
import { Response } from "express";
import { getJwtToken } from "./geJwtToken";

export const cookieToken = (user: User, res: Response) => {
  const token = getJwtToken(user.id);
  const options = {
    expires: new Date(Date.now() + 259200000),
    httpOnly: true,
  };
  // override user
  user.password = "";

  res
    .status(200)
    .cookie("token", token, options)
    .json({ success: true, token: token, user: user });
};
