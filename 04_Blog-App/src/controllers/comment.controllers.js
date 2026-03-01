import { asyncHandler } from "../utils/asyncHandler.js";
import {Comment}from'../models/comment.model.js'

export const addNewComment = asyncHandler(async (req, res) => {
  // extract comment body and blog id
  const { body } = req.body;
  const blogId = req.params.blogId;

  if (!body || body.trim() === "") {
    return res.status(400).json({ message: "Comment body is required" });
  }

  // add comment on db
  await Comment.create({
    body,
    blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${blogId}`);
});
