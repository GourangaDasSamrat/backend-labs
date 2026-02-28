import { Blog } from '../models/blog.model.js'
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addNewBlog = asyncHandler(async (req, res) => {
  // extract blog title and and body from request body
  let { title, body } = req.body;
  title = title?.trim();
  body = body?.trim();

  // Validate required fields
  if (!title || !body) {
    throw new ApiError(400, "All fields are required");
  }

  // extract cover
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // upload cover
  const coverImage = coverImageLocalPath
    ? await upload(coverImageLocalPath)
    : null;

  // create entry on db
  const blog = await Blog.create({
    title,
    body,
    coverImage: coverImage?.url || "",
    createdBy: req.user._id,
  });

  // redirect to home
  return res.redirect(`/blog/${blog._id}`);
});
