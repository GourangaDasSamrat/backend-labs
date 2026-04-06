import { Schema, model } from "mongoose";

const urlSchema = new Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamps: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true },
);

export const Url = model("Url", urlSchema);
