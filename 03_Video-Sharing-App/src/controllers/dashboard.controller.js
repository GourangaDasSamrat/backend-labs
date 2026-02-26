import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  const [videoStats] = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$likes" } },
      },
    },
  ]);

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  const stats = {
    totalVideos: videoStats?.totalVideos || 0,
    totalViews: videoStats?.totalViews || 0,
    totalLikes: videoStats?.totalLikes || 0,
    totalSubscribers,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  const videos = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
