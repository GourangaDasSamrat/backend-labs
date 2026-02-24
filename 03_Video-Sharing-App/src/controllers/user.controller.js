import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse as response } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary as upload } from "../utils/cloudinary.js";
import { deleteLocalFile } from "../utils/fileHelper.js";

// secure cookies options
const options = {
  httpOnly: true,
  secure: true,
};

// generate access & refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    //generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // add refresh token in the user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating access & refresh tokens"
    );
  }
};

// register user
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
    .json(new response(201, createdUser, "User registered successfully"));
});

// login user
export const loginUser = asyncHandler(async (req, res) => {
  // Extract & normalize fields
  let { userName, email, password } = req.body;
  userName = userName?.trim().toLowerCase();
  email = email?.trim().toLowerCase();

  // Check username & email not exist
  if (!userName && !email) {
    throw new ApiError(400, "Username or email required");
  }

  // Check username or email
  const user = await User.findOne({
    $or: [...(userName ? [{ userName }] : []), ...(email ? [{ email }] : [])],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  //generate refresh and access tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // update refresh tokens on user
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Return response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new response(
        201,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  // extract user id from request
  const userId = req.user._id;

  // find user by id and remove refresh token
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      after: true,
    }
  );

  // return response
  return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new response(201, {}, "User logged out successfully"));
});

// refresh access token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  // extract refresh token
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // decode token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    // check user
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // match refresh token
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // generate new access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // return response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new response(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid refresh token", err);
  }
});

// change password
export const changePassword = asyncHandler(async (req, res) => {
  // extract old, new & conform passwords
  const { oldPassword, newPassword, confPassword } = req.body;

  // check new and conf pass is same or not
  if (!(newPassword === confPassword)) {
    throw new ApiError(400, "New password and conform password not matched");
  }

  // extract user id from middleware
  const userId = req.user?._id;

  // find user
  const user = await User.findById(userId);

  // check is old password correct
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  // set new password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // return response
  return res
    .status(200)
    .json(new response(200, {}, "Password changed successfully"));
});

// get current user
export const getCurrentUser = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(new response(200, req.user, "Current user fetched successfully"))
);

// update account details
export const updateAccountDetails = asyncHandler(async (req, res) => {
  // extract details
  const { fullname, email, userName } = req.body;

  if (!fullname || !email || !userName) {
    throw new ApiError(400, "All fields are required");
  }

  // get user id from middleware
  const userId = req.user?._id;

  // find and update user
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullname,
        email,
        userName,
      },
    },
    {
      after: true,
    }
  ).select("-password");

  // return response
  return res
    .status(200)
    .json(new response(200, user, "Updating account details successfully"));
});

// update account avatar
export const updateAccountAvatar = asyncHandler(async (req, res) => {
  // extract avatar file
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // upload avatar on cloudinary
  const avatar = await upload(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Something went wrong when upload avatar file");
  }

  // update avatar url on database
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { after: true }
  ).select("-password");

  return res
    .status(200)
    .json(new response(200, user, "Avatar update successfully"));
});

// update account cover
export const updateAccountCover = asyncHandler(async (req, res) => {
  // extract cover image file
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  // upload cover image on cloudinary
  const coverImage = await upload(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(
      500,
      "Something went wrong when upload cover image file"
    );
  }

  // update cover image url on database
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { after: true }
  ).select("-password");

  return res
    .status(200)
    .json(new response(200, user, "Cover image update successfully"));
});

// get user channel profile
export const getUserChannelProfile = asyncHandler(async (req, res) => {
  // extract params from request params
  const { userName } = req.params;

  if (!userName?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  // aggregation pipeline to get subscriber & subscribed counts & isSubscribed status
  const channel = await User.aggregate([
    {
      $match: {
        userName: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        userName: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  // return response
  return res
    .status(200)
    .json(new response(200, channel[0], "User channel fetched successfully"));
});

// get watch history
export const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
});
