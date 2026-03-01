import { Schema, Types, model } from "mongoose";

const commentSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      minlength: [10, "Blog title must be at least 10 characters"],
      maxlength: [70, "Blog title can't exceed 7 characters"],
    },
    blogId: {
      type: Types.ObjectId,
      ref: "Blog",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Comment = model("Comment", commentSchema);
