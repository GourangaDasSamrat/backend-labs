import { nanoid } from "nanoid";
import { Url } from "../models/url.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const generateShortUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "Original url required" });
  }

  // allow only http/https
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ message: "Only http/https URLs allowed" });
  }

  const shortId = nanoid(8);

  await Url.create({
    shortId,
    redirectURL: url,
    visitHistory: [],
  });

  return res.json({ id: shortId });
});

export const redirectToOriginalUrl = asyncHandler(async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await Url.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamps: Date.now() } } },
  );

  if (!entry) {
    return res.status(404).json({ message: "Short URL not found" });
  }

  return res.redirect(entry.redirectURL);
});
