import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Video unliked successfully")
      );
  }

  const like = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Comment unliked successfully")
      );
  }

  await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Comment liked successfully"));
});

const togglePostLike = asyncHandler(async (req, res) => {
  const { PostId } = req.params;

  if (!isValidObjectId(PostId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const existingLike = await Like.findOne({
    post: PostId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Post unliked successfully")
      );
  }

  await Like.create({
    post: PostId,
    likedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { liked: true }, "Post liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $exists: true, $ne: null },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { userName: 1, fullname: 1, avatar: 1 } }],
            },
          },
          { $unwind: "$owner" },
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              description: 1,
              duration: 1,
              views: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$video" },
    { $replaceRoot: { newRoot: "$video" } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, togglePostLike, toggleVideoLike, getLikedVideos };
