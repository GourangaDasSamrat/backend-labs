import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

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
    type: Number,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: {
      type: [orderItemSchema],
    },
    address: {
      type: [addressSchema],
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELED", "ACCEPTED", "DELIVERED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
