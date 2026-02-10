import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Todo = mongoose.model("Todo", todoSchema);
