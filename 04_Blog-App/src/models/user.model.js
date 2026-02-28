import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "node:crypto";
import { ApiError } from "../utils/ApiError.js";
import { createTokenForUser } from "../utils/auth.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username can't exceed 20 characters"],
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please use a valid email address",
      ],
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    salt: {
      type: String,
    },

    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      default: "/img/avatar.png",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

// hash password before save in database
userSchema.pre("save", function () {
  if (!this.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
});

// hash password and check when signin
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) throw new ApiError(404, "User not found");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash)
    throw new ApiError(400, "Incorrect password");

  const token = createTokenForUser(user);

  return token;
});

export const User = model("User", userSchema);
