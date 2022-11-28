import { orderRepository } from "../repositories";

class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async addOrder(orderInfo) {
    const createdOrder = await this.orderRepository.create(orderInfo);
    return createdOrder;
  }

  async getOrderById(orderId) {
    const foundOrder = await this.orderRepository.findById(orderId);
    if (!foundOrder) {
      throw new Error("해당 id의 주문은 없습니다. 다시 한 번 확인해 주세요.");
    }
    return foundOrder;
  }

  async getAllOrders() {
    const foundOrders = await this.orderRepository.findAll();
    return foundOrders;
  }

  async getOrdersByUserId(userId) {
    const foundOrders = await this.orderRepository.findAllByUserId(userId);
    return foundOrders;
  }

  async setOrder(orderId, updateInfo) {
    const updatedOrder = await this.orderRepository.update({
      orderId,
      updateInfo,
    });
    return updatedOrder;
  }

  async removeOrderById(orderId) {
    const { deletedCount } = await this.orderRepository.deleteById(orderId);
    if (deletedCount === 0) {
      throw new Error(`${orderId} 주문의 삭제에 실패하였습니다`);
    }
    return { result: "success" };
  }
}

const orderService = new OrderService(orderRepository);

export { orderService };
