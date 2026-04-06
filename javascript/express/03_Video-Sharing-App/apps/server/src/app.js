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
      title: "Stream Vault",
      version: "1.0.0",
      description: "Stream Vault api documentation",
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
  apis: ["../../../docs/*.yaml"],
};

const uiOptions = {
  customSiteTitle: "Stream Vault | Api Docs",
  customfavIcon: "../../../libs/img/favicon.svg",
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
//serve docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, uiOptions));
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
import {
  commentRouter,
  dashboardRouter,
  healthcheckRouter,
  likeRouter,
  playlistRouter,
  postRouter,
  subscriptionRouter,
  userRouter,
  videoRouter,
} from "./routes/index.js";

// routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// export initialized express app
export default app;
