import "dotenv/config";
import { userRouter } from '@/routes/user.routes';
import Fastify from "fastify";

// create fastify instance
const fastify = Fastify({
  logger: true,
});

// Register routes plugins
fastify.register(userRouter)

// Run the server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;

    await fastify.listen({ port });
    console.log("Server is running on port ", port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
