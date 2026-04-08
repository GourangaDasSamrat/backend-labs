import { FastifyReply, FastifyRequest } from "fastify";
import argon2 from "argon2";
import { CreateUserBody } from "@/types/user.types";

export const registerUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) => {
  const { name, email, password } = request.body;

  try {
    // 1. Hash Password
    const hashedPassword = await argon2.hash(password);

    // 2. Database Logic
    const db = request.server.mongo.db;
    if (!db) {
      request.server.log.error("Database connection missing");
      return reply.code(500).send({ message: "Internal server error" });
    }

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // 3. Success Response
    return reply.code(201).send({
      id: result.insertedId.toString(),
      message: "User created successfully",
    });
  } catch (error) {
    request.server.log.error(error);
    return reply.code(500).send({ message: "Failed to create user" });
  }
};