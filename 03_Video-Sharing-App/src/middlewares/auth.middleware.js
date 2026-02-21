import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyAuth = asyncHandler(async (req, res, next) => {
  try {
    // extract access token from cookie or header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // check access token exist or not
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // decode token
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    // check user
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // add new object in req
    req.user = user;

    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid access token");
  }
});
