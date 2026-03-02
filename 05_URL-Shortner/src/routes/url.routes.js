import { Router } from "express";
import {
  generateShortUrl,
  getAnalytics,
  redirectToOriginalUrl,
} from "../controllers/url.controllers.js";

const router = Router();

// generate short url
router.post("/", generateShortUrl);

// redirect to original url
router.get("/:shortId", redirectToOriginalUrl);

// get analytics
router.get("/analytics/:shortId", getAnalytics);

export default router;
