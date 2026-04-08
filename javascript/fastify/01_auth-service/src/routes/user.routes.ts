import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { createUserSchema, loginUserSchema } from "@/types/user.types";
import {
  registerUserHandler,
  loginHandler,
  logoutHandler,
} from "@/controllers/user.controller";

const userRouteHandler = async (fastify: FastifyInstance): Promise<void> => {
  // Registration
  fastify.post(
    "/api/v1/users/register",
    { schema: createUserSchema },
    registerUserHandler
  );

  // Login
  fastify.post(
    "/api/v1/users/login",
    { schema: loginUserSchema },
    loginHandler
  );

  // Logout
  fastify.post("/api/v1/users/logout", logoutHandler);
};

export const userRouter = fp(userRouteHandler);
