import mongoose, { isValidObjectId } from "mongoose";
import { Post } from "../models/Post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPost = asyncHandler(async (req, res) => {
  //TODO: create Post
});

const getUserPosts = asyncHandler(async (req, res) => {
  // TODO: get user Posts
});

const updatePost = asyncHandler(async (req, res) => {
  //TODO: update Post
});

const deletePost = asyncHandler(async (req, res) => {
  //TODO: delete Post
});

export { createPost, getUserPosts, updatePost, deletePost };
