import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary as upload } from "../utils/cloudinary.js";
import { Comment } from "../models/comment.model.js";

// add new blog
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
  const coverImageLocalPath = req.file?.path;

  // upload cover
  const coverImage = coverImageLocalPath
    ? await upload(coverImageLocalPath)
    : null;

  // create entry on db
  const blog = await Blog.create({
    title,
    body,
    coverImage:
      coverImage?.url || "https://i.postimg.cc/RZ68Y7TF/theme-nord.png",
    createdBy: req.user._id,
  });

  // redirect to home
  return res.redirect(`/blog/${blog._id}`);
});

// dynamic blog
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy",
  );
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});
