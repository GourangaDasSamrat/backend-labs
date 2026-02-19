import { User } from "../models/user.model.js";
import { ApiError as Error } from "../utils/ApiError.js";
import { ApiResponse as response } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary as upload } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  // extract fields from request body
  const { userName, email, password, fullname } = req.body;

  // run query on database to find username or email is already exist
  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  // extract files from request middleware using multer
  const avatarLocalPath = req.files?.avatar[0].path(),
    coverImageLocalPath = req.files?.coverImage[0].path();

  // check if any of the required field not exist throe 400 error
  if (
    [userName, email, password, fullname].some((field) => field?.trim() === "")
  ) {
    throw new Error(400, "All fields are required");
  }

  // check if the same username or email exist on database throw 409 error
  if (existedUser) {
    throw new Error(409, "User with username or email already exist");
  }

  // check if the avatar is not on the request throw 400 error
  if (!avatarLocalPath) {
    throw new Error(400, "Avatar image is required");
  }

  // upload files to cloudinary
  const avatar = await upload(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await upload(coverImageLocalPath)
    : null;

  // check if image upload successfully in cloudinary
  if (!avatar) {
    throw new Error(400, "Avatar image is required");
  }

  // create new entry in database
  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // check if user entry successfully created or not by running database query then remove password and refreshToken fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new Error(
      500,
      "Something went wrong while while registering the user"
    );
  }

  // return response
  return res
    .status(201)
    .json(new response(200, createdUser, "User registered successfully"));
});
