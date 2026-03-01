import { asyncHandler } from "../utils/asyncHandler.js";
import {Url} from '../models/url.model.js'
import { nanoid } from "nanoid";

export const generateShortUrl = asyncHandler(async (req, res) => {
  // extract original url from req body
  const { url } = req.body;

  if (!url) return res.status(400).json({ message: "Original url required" });

  // generate shortid
  const shortId = nanoid(8);

  //create doc on db
  await Url.create({
    shortId,
    redirectURL: url,
    visitHistory: [],
  });

  return res.json({ id: shortId });
});
