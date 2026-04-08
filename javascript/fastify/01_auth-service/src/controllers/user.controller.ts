import { FastifyReply, FastifyRequest } from "fastify";
import argon2 from "argon2";
import { CreateUserBody, LoginUserBody } from "@/types/user.types";

export const registerUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) => {
  const { name, email, password } = request.body;

  try {
    const db = request.server.mongo.db;
    if (!db) return reply.code(500).send({ message: "DB Connection Error" });

    const userCollection = db.collection("users");

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return reply
        .code(409)
        .send({ message: "A user with this email already exists." });
    }

    const hashedPassword = await argon2.hash(password);

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
    if (error.code === 11000) {
      return reply.code(409).send({ message: "Email already in use" });
    }
    request.server.log.error(error);
    return reply.code(500).send({ message: "Internal server error" });
  }
};

/**
 * Handles user login and sets HttpOnly JWT cookie
 */
export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginUserBody }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;

  try {
    const db = request.server.mongo.db;
    const user = await db?.collection("users").findOne({ email });

    // Use a generic error message for security
    if (!user || !(await argon2.verify(user.password, password))) {
      return reply.code(401).send({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = await reply.jwtSign({
      id: user._id,
      email: user.email,
    });

    // Set Secure HttpOnly Cookie
    return reply
      .setCookie("access_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      })
      .code(200)
      .send({ message: "Login successful" });
  } catch (error) {
    request.server.log.error(error);
    return reply.code(500).send({ message: "Internal server error" });
  }
};

/**
 * Clears the access_token cookie
 */
export const logoutHandler = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply
    .clearCookie("access_token", { path: "/" })
    .code(200)
    .send({ message: "Logout successful" });
};
