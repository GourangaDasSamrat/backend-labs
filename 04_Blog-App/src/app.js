import cors from "cors";
import express from "express";
import path from "path";

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
  })
);

// configure ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

// serve page
app.get("/", (_, res) => res.render("home"));

// import routes
import { userRouter } from "./routes/index.js";

// declare routes
app.use("/users", userRouter);

// export initialized express app
export default app;
