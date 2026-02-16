import { model, Schema, Types } from "mongoose";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: [true, "Video is required"],
    },
    thumbnail: {
      type: String, // cloudinary url
      required: [true, "Thumbnail is required"],
    },
    title: {
      type: String,
      required: [true, "Video's title is required"],
    },
    description: {
      type: String,
      required: [true, "Video's description is required"],
    },
    duration: {
      type: Number, // cloudinary duration
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const video = model("Video", videoSchema);
