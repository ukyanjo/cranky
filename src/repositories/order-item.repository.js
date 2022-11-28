import { model } from "mongoose";
import { OrderItemSchema } from "./schemas";

const OrderItem = model("order-items", OrderItemSchema);

export class OrderItemRepository {
  async create(orderItemInfo) {
    const createdOrderItem = await OrderItem.create(orderItemInfo);
    return createdOrderItem;
  }

  async findById(orderItemId) {
    const foundOrderItem = await OrderItem.findOne({ _id: orderItemId });
    return foundOrderItem;
  }

  async findAll() {
    const foundOrderItems = await OrderItem.find({});
    return foundOrderItems;
  }

  async findAllByOrderId(orderId) {
    const foundOrderItems = await OrderItem.find({ orderId });
    return foundOrderItems;
  }

  async findAllByProductId(productId) {
    const foundOrderItems = await OrderItem.find({ productId });
    return foundOrderItems;
  }

  async update({ orderItemId, updateInfo }) {
    const filter = { _id: orderItemId };
    const option = { returnOriginal: false };

    const updatedOrderItem = await OrderItem.findOneAndUpdate(
      filter,
      updateInfo,
      option
    );
    return updatedOrderItem;
  }

  async deleteById(orderItemId) {
    const result = await OrderItem.deleteOne({ _id: orderItemId });
    return result;
  }
}

const orderItemRepository = new OrderItemRepository();

export { orderItemRepository };
