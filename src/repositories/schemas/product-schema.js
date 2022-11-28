import { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categorys",
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    imageKey: {
      type: String,
      required: false,
    },
    inventory: {
      type: Number,
      min: 0,
      default: 10,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    searchKeywords: {
      type: [String],
      required: true,
    },
    discountRate: {
      type: Number,
      min: 0,
      max: 95,
      default: 0,
      required: false,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

export { ProductSchema };
