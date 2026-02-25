import { Schema, Types, model } from "mongoose";

const likeSchema = new Schema(
  {
    video: {
      type: Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Types.ObjectId,
      ref: "Comment",
    },
    post: {
      type: Types.ObjectId,
      ref: "Post",
    },
    likedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Like = model("Like", likeSchema);
