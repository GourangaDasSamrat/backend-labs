import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: [true, "Username must be in lowercase"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: [true, "Email must be in lowercase"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
