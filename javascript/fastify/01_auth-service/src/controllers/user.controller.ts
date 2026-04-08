import { FastifyReply, FastifyRequest } from "fastify";
import argon2 from "argon2";
import { CreateUserBody } from "@/types/user.types";

export const registerUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) => {
  const { name, email, password } = request.body;

  try {
    const db = request.server.mongo.db;
    if (!db) return reply.code(500).send({ message: "DB Connection Error" });

    const userCollection = db.collection("users");

    // 1. Check if user already exists
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return reply.code(409).send({
        message: "A user with this email already exists.",
      });
    }

    // 2. Only hash password if user doesn't exist (saves CPU)
    const hashedPassword = await argon2.hash(password);

    // 3. Insert user
    const result = await userCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return reply.code(201).send({
      id: result.insertedId.toString(),
      message: "User created successfully",
    });
  } catch (error: any) {
    // Catch database unique index violation (Error code 11000)
    if (error.code === 11000) {
      return reply.code(409).send({ message: "Email already in use" });
    }

    request.server.log.error(error);
    return reply.code(500).send({ message: "Internal server error" });
  }
};
