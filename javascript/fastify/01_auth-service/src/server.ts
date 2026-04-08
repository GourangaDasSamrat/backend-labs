import "dotenv/config";
import Fastify, { FastifyInstance } from "fastify";
import fastifyMongo from "@fastify/mongodb";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { userRouter } from "@/routes/user.routes";

/**
 * Initialize instance with explicit Type Provider casting
 */
const fastify: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<JsonSchemaToTsProvider>();

/**
 * Database Connection
 */
fastify.register(fastifyMongo, {
  forceClose: true,
  url: process.env.MONGODB_URI as string,
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