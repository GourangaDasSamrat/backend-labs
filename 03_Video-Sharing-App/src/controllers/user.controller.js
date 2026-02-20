import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse as response } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary as upload } from "../utils/cloudinary.js";
import { deleteLocalFile } from "../utils/fileHelper.js";

export const registerUser = asyncHandler(async (req, res) => {
  // Extract & normalize fields
  let { userName, email, password, fullname } = req.body;
  userName = userName?.trim().toLowerCase();
  email = email?.trim().toLowerCase();
  fullname = fullname?.trim();

  // Validate required fields
  if (!userName || !email || !password || !fullname) {
    throw new ApiError(400, "All fields are required");
  }

  // Extract files safely
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    deleteLocalFile(coverImageLocalPath);
    throw new ApiError(400, "Avatar image is required");
  }

  // Check duplicate user
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    deleteLocalFile(avatarLocalPath);
    deleteLocalFile(coverImageLocalPath);
    throw new ApiError(409, "User with username or email already exists");
  }

  // Upload images
  const avatar = await upload(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await upload(coverImageLocalPath)
    : null;

  if (!avatar) {
    deleteLocalFile(coverImageLocalPath);
    throw new ApiError(400, "Avatar upload failed");
  }

  // Create user
  const user = await User.create({
    userName,
    email,
    password,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return response
  return res
    .status(201)
    .json(new response(200, createdUser, "User registered successfully"));
});