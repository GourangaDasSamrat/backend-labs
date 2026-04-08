import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { createUserSchema } from "@/types/user.types";
import { registerUserHandler } from "@/controllers/user.controller";

const userRouteHandler = async (fastify: FastifyInstance): Promise<void> => {
  /**
   * POST /api/v1/users
   * Purpose: Register a new user
   */
  fastify.post(
    "/api/v1/users",
    { schema: createUserSchema },
    registerUserHandler
  );
};

export const userRouter = fp(userRouteHandler);