import { Schema, Types, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [15, "Blog title must be at least 15 characters"],
      maxlength: [72, "Blog title can't exceed 72 characters"],
    },
    body: {
      type: String,
      required: true,
      minlength: [30, "Blog content must be at least 30 characters"],
      maxlength: [5000, "Blog content can't exceed 5000 characters"],
    },
    coverImage: {
      type: String,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Blog = model("Blog", blogSchema);
