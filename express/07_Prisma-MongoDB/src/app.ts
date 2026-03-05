import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// initialize express app
const app = express();

// configure port
export const port = process.env.PORT || 3000;

// constant for limit
const limit = "16kb";

// configure cors for cross origin connection
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS, // frontend app's url
    credentials: true, // allow credentials
  }),
);

// configure rate limiter for json
app.use(
  express.json({
    limit,
  }),
);

// config url encoder
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// setup cookie
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes";

// create endpoints
app.use("/api/v1/user", userRouter);

// export initialized express app
export default app;
