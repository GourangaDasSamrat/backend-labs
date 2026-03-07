import { errorHandler } from "@/middlewares/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import userRouter from "@/routes/user.routes";

// initialize express app
const app = express();

// configure port
export const port = process.env.PORT || 3000;

// request size limit
const limit = "16kb";

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS || "*",
    credentials: true,
  })
);

// JSON parser
app.use(
  express.json({
    limit,
  })
);

// URL encoded parser
app.use(
  express.urlencoded({
    extended: true,
    limit,
  })
);

// cookie parser
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRouter);

// error handler (must be last)
app.use(errorHandler);

export default app;