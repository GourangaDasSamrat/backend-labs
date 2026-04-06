import { User } from "@/types/prisma";
import { getJwtToken } from "@/utils/getJwtToken";
import { Response } from "express";

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
