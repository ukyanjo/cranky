import { model } from "mongoose";
import { OrderSchema } from "./schemas";

const Order = model("orders", OrderSchema);

export class OrderRepository {
  async create(orderInfo) {
    const createdOrder = await Order.create(orderInfo);
    return createdOrder;
  }

  async findById(orderId) {
    const foundOrder = await Order.findOne({ _id: orderId });
    return foundOrder;
  }

  async findAll() {
    const foundOrders = await Order.find({});
    return foundOrders;
  }

  async findAllByUserId(userId) {
    const foundOrders = await Order.find({ userId });
    return foundOrders;
  }

  async update({ orderId, updateInfo }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const updatedOrder = await Order.findOneAndUpdate(
      filter,
      updateInfo,
      option
    );
    return updatedOrder;
  }

  async deleteById(orderId) {
    const result = await Order.deleteOne({ _id: orderId });
    return result;
  }
}

const orderRepository = new OrderRepository();

export { orderRepository };
