import { Router } from "express";
import {
  generateShortUrl,
  redirectToOriginalUrl,
} from "../controllers/url.controllers.js";

const router = Router();

// generate short url
router.post("/", generateShortUrl);

// redirect to original url
router.get("/:shortId", redirectToOriginalUrl);

export default router;
