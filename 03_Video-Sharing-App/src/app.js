import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// initialize express app
const app = express();

// constant for limit
const limit = "16kb";

// configure port
export const port = process.env.PORT || 3000;

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Video Share",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // docs file
  apis: ["./docs/*.yaml"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// configure cors for cross origin connection
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS, // frontend app's url
    credentials: true, // allow credentials
  })
);

// configure rate limiter for json
app.use(
  express.json({
    limit,
  })
);

// config url encoder
app.use(
  express.urlencoded({
    extended: true,
    // limit
  })
);

// config for serve static files (in this case files inside public folder)
app.use(express.static("public"));

// config for secure cookies
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

// export initialized express app
export default app;
