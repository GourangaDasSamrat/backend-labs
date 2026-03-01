import { Blog } from './models/blog.model.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { verifyAuth } from "./middlewares/auth.middleware.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// initialize express app
const app = express();

// configure port
export const port = process.env.PORT || 3000;

// constant for limit
const limit = "16kb";

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blogify — Modern Blogging Platform",
      version: "1.0.0",
      description: "Blogify api documentation",
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

const uiOptions = {
  customSiteTitle: "Blogify | Api Docs",
  customfavIcon: "https://i.postimg.cc/P55fvRT8/favicon.png",
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
//serve docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, uiOptions))

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
  const allBlogs = await Blog.find({}).populate("createdBy");
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

// import routes
import { blogRoutes, userRouter,commentRouter } from "./routes/index.js";

// declare routes
app.use("/blog", blogRoutes);
app.use("/users", userRouter);
app.use("/comment", commentRouter);

// export initialized express app
export default app;
