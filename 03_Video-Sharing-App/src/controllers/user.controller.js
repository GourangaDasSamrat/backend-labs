import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse as response } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary as upload } from "../utils/cloudinary.js";
import { deleteLocalFile } from "../utils/fileHelper.js";

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
  if (!userName || !email) {
    throw new ApiError(400, "Username or email required");
  }

  // Check username or email
  const user = await User.findOne({
    $or: [{ userName }, { email }],
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
  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );

  // secure cookies options
  const options = {
    httpOnly: true,
    secure: true,
  };

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
