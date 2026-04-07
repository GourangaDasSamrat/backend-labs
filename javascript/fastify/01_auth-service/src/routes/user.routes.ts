import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const userRouter = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) => {
  fastify.get("/api/v1/users", async (request, reply) => {
    return {
      message: "User created successfully",
    };
  });
};
