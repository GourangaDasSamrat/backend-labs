import jwt from "jsonwebtoken";
import { ApiError } from './apiError';

const secret = process.env.JWT_SECRET;
const expiry = process.env.JWT_TOKEN_EXPIRES_IN;

if (!secret) throw new ApiError(500,"JWT_SECRET is not defined");
if (!expiry) throw new ApiError(500,"JWT_TOKEN_EXPIRES_IN is not defined");

export const getJwtToken = (userId: string): string =>
  jwt.sign({ userId }, secret, { expiresIn: expiry as any });
