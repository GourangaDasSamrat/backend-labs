import cors from "cors";
import express from "express";
import { Url } from "./models/url.model.js"
import path from "path"

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

// configure ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

// serve page
app.get("/", async (req, res) => {
  const allUrls = await Url.find({});
  const totalClicks = allUrls.reduce(
    (sum, u) => sum + (u.visitHistory?.length || 0),
    0,
  );
  res.render("home", { allUrls, totalClicks, host: req.headers.host });
});


// import routes
import urlRoute from './routes/url.routes.js';

app.use('/',urlRoute)

// export initialized express app
export default app;
