import { Router } from "express";
import {
  generateShortUrl,
  redirectToOriginalUrl,
  getAnalytics,
} from "../controllers/url.controllers.js";

const router = Router();

// POST /url → shorten a URL
router.post("/url", generateShortUrl);

// GET /:shortId → redirect to original URL
router.get("/:shortId", redirectToOriginalUrl);

// GET /url/:shortId/analytics → JSON analytics
router.get("/url/:shortId/analytics", getAnalytics);

export default router;