import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
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

    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      required: [true, "Avatar image is required"],
    },

    coverImage: {
      type: String,
      default: "",
    },

    watchHistory: [
      {
        type: Types.ObjectId,
        ref: "Video",
      },
    ],

    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
