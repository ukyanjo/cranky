import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: new Schema(
        {
          postalCode: String,
          address1: String,
          address2: String,
          receiverName: String,
          receiverPhoneNumber: String,
        },
        {
          _id: false,
        }
      ),
      required: true,
    },
    request: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      enum: ["상품 준비중", "상품 배송중", "상품 배송완료"],
      default: "상품 준비중",
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

export { OrderSchema };
