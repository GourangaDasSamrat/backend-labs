import cors from "cors";
import express from "express";
import path from "path";
import { Url } from "./models/url.model.js";
import urlRoute from "./routes/url.routes.js";

// initialize express app
const app = express();

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

// configure ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));

// ─── Page Routes (must be BEFORE urlRoute) ────────────────────────────────────

app.get("/", async (req, res) => {
  const allUrls = await Url.find({});
  const totalClicks = allUrls.reduce(
    (sum, u) => sum + (u.visitHistory?.length || 0),
    0
  );
  res.render("home", { allUrls, totalClicks, host: req.headers.host });
});

app.get("/analytics", async (req, res) => {
  const allUrls = await Url.find({});
  res.render("analytics", { allUrls, shortId: null, urlData: null });
});

app.get("/analytics/:shortId", async (req, res) => {
  const allUrls = await Url.find({});
  const urlData = await Url.findOne({ shortId: req.params.shortId });
  if (!urlData) return res.status(404).send("Short URL not found");
  res.render("analytics", {
    allUrls,
    shortId: req.params.shortId,
    urlData,
  });
});

// ─── API + Redirect Routes ────────────────────────────────────────────────────

app.use("/", urlRoute);

// export initialized express app
export default app;