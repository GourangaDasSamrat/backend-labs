import { nanoid } from "nanoid";
import { Url } from "../models/url.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /url
export const generateShortUrl = asyncHandler(async (req, res) => {
  const { redirectURL } = req.body;

  if (!redirectURL) {
    return res.status(400).json({ message: "Original URL is required" });
  }

  // Allow only http/https
  if (!/^https?:\/\//i.test(redirectURL)) {
    return res.status(400).json({ message: "Only http/https URLs are allowed" });
  }

  const shortId = nanoid(8);

  await Url.create({
    shortId,
    redirectURL,
    visitHistory: [],
  });

  return res.status(201).json({ shortId });
});

// GET /:shortId
export const redirectToOriginalUrl = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const entry = await Url.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamps: Date.now() } } },
    { returnDocument: "before" }
  );

  if (!entry) {
    return res.status(404).json({ message: "Short URL not found" });
  }

  return res.redirect(entry.redirectURL);
});

// GET /url/:shortId/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const result = await Url.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ message: "Short URL not found" });
  }

  return res.status(200).json({
    shortId: result.shortId,
    redirectURL: result.redirectURL,
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
});