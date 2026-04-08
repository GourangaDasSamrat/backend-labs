import "dotenv/config";
import Fastify, { FastifyInstance } from "fastify";
import fastifyMongo from "@fastify/mongodb";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { userRouter } from "@/routes/user.routes";

const fastify: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<JsonSchemaToTsProvider>();

/**
 * JWT Configuration
 */
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "super-secret-key-change-me",
});

/**
 * Cookie Configuration
 */
fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || "cookie-secret-key",
  hook: "onRequest",
});

/**
 * Database Connection
 */
fastify.register(fastifyMongo, {
  forceClose: true,
  url: process.env.MONGODB_URI as string,
});

/**
 * Create unique index for email to prevent duplicates at DB level
 */
fastify.ready(async () => {
  try {
    await fastify.mongo.db
      ?.collection("users")
      .createIndex({ email: 1 }, { unique: true });
  } catch (err) {
    fastify.log.error("Index creation failed", err);
  }
});

/**
 * Routes Registration
 */
fastify.register(userRouter);

const start = async (): Promise<void> => {
  try {
    const port = Number(process.env.PORT) || 4000;
    await fastify.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
