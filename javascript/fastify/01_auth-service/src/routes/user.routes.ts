import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import argon2 from "argon2";
import { createUserSchema, CreateUserBody, CreateUserReply } from "@/types/user.types";

/**
 * We wrap the router in fastify-plugin (fp) so that decorations
 * (like fastify.mongo) are accessible inside this scope.
 */
const userRouteHandler = async (fastify: FastifyInstance): Promise<void> => {

  fastify.post<{
    Body: CreateUserBody;
    Reply: CreateUserReply | { message: string };
  }>(
    "/api/v1/users",
    { schema: createUserSchema },
    async (request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply): Promise<void> => {
      const { name, email, password } = request.body;

      try {
        // Professional Argon2 Hashing
        const hashedPassword = await argon2.hash(password);

        const db = fastify.mongo.db;
        if (!db) {
          fastify.log.error("Database connection unavailable");
          return reply.code(500).send({ message: "Internal Server Error" });
        }

        const result = await db.collection("users").insertOne({
          name,
          email,
          password: hashedPassword,
          createdAt: new Date(),
        });

        return reply.code(201).send({
          id: result.insertedId.toString(),
          message: "User created successfully",
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ message: "Error during user registration" });
      }
    }
  );
};

export const userRouter = fp(userRouteHandler);