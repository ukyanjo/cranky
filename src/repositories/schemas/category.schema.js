import { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      enum: ["OUTWEAR", "TOPS", "BOTTOMS", "FOOTWEAR", "ACCESSORIES"],
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageKey: {
      type: String,
      required: false,
    },
  },
  {
    collection: "categorys",
    timestamps: true,
  }
);

export { CategorySchema };
