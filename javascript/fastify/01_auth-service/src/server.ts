import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import Fastify, { FastifyInstance } from "fastify";
import fastifyMongo from "@fastify/mongodb";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import yaml from "js-yaml";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { userRouter } from "@/routes/user.routes";

const fastify: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<JsonSchemaToTsProvider>();

/**
 * Swagger Documentation Setup
 * Reads the external YAML file and registers the Swagger UI
 */
const openApiYaml = fs.readFileSync(
  path.join(__dirname, "docs/openapi.yaml"),
  "utf8"
);
const swaggerConfig = yaml.load(openApiYaml) as any;

fastify.register(fastifySwagger, {
  openapi: swaggerConfig,
});

fastify.register(fastifySwaggerUi, {
  routePrefix: "/docs", // Access at http://localhost:4000/docs
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

/**
 * Standard Plugins
 */
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "dev-secret",
});
fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || "cookie-secret",
  hook: "onRequest",
});
fastify.register(fastifyMongo, {
  forceClose: true,
  url: process.env.MONGODB_URI as string,
});

/**
 * Database Readiness & Indexing
 */
fastify.ready(async () => {
  try {
    await fastify.mongo.db
      ?.collection("users")
      .createIndex({ email: 1 }, { unique: true });
    fastify.log.info("Swagger documentation initialized at /docs");
  } catch (err) {
    fastify.log.error("Startup initialization failed", err);
  }
});

fastify.register(userRouter);

const start = async (): Promise<void> => {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) || 4000,
      host: "0.0.0.0",
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
