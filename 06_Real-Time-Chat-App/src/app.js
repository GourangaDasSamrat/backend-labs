import cors from "cors";
import express from "express";
import http from "http";

// initialize express app
const app = express();

// create server
const server = http.createServer(app);

// configure port
export const port = process.env.PORT || 3000;

// constant for limit
const limit = "16kb";

// configure cors
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS,
    credentials: true,
  }),
);

// parse json
app.use(express.json({ limit }));

// serve static public folder
app.use(express.static("/public"));

// export initialized http server
export default server;
