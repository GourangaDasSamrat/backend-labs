import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// initialize express app
const app = express();

// initialize http server
const server = http.createServer(app);

// initialize io with transports config for Render hosting
const io = new Server(server, {
  transports: ["polling", "websocket"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

// serve static public folder (public/ is at root, one level above src/)
app.use(express.static(path.join(__dirname, "..", "public")));

// get route for public folder
app.get("/", (_, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));

// export initialized http server
export { io, server };
