import { User } from "@db/client";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}