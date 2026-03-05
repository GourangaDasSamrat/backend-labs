import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    enum: [
      "Bangladesh",
      "United Kingdom",
      "United States of America",
      ,
      "Canada",
      "France",
    ],
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
});

export const Address = mongoose.model("Address", addressSchema);
