import { Blog } from './models/blog.model.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { verifyAuth } from "./middlewares/auth.middleware.js";

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

// setup check for auth
app.use(verifyAuth("token"));

// configure ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

// serve page
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

// import routes
import { blogRoutes, userRouter } from "./routes/index.js";

// declare routes
app.use("/blog", blogRoutes);
app.use("/users", userRouter);

// export initialized express app
export default app;
