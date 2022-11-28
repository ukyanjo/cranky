import { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "proucts",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["상품 준비중", "상품 배송중", "상품 배송완료"],
      required: false,
      default: "상품 준비중",
    },
  },
  {
    collection: "order-items",
    timestamps: true,
  }
);

export { OrderItemSchema };
