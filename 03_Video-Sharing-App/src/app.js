import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// initialize express app
const app = express();

// constant for limit
const limit = "16kb";

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

// export initialized express app
export default app;
