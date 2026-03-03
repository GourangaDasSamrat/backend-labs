import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

// initialize express app
const app = express();

// initialize http server
const server = http.createServer(app);

// initialize io
const io = new Server(server);

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
app.use(express.static(path.resolve("./public")));

// get route for public folder
app.get("/", (_, res) => res.sendFile("/public/index.html"));

// export initialized http server
export { io, server };
