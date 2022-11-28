import { orderItemRepository } from "../repositories";

class OrderItemService {
  constructor(orderItemRepository) {
    this.orderItemRepository = orderItemRepository;
  }

  async addOrderItem(orderItemInfo) {
    const createdOrderItem = await this.orderItemRepository.create(
      orderItemInfo
    );
    return createdOrderItem;
  }

  async getOrderItemById(orderItemId) {
    const foundOrderItem = await this.orderItemRepository.findById(orderItemId);
    if (!foundOrderItem) {
      throw new Error(
        "해당 id의 주문아이템은 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    return foundOrderItem;
  }

  async getAllOrderItems() {
    const foundOrderItems = await this.orderItemRepository.findAll();
    return foundOrderItems;
  }

  async getOrderItemsByOrderId(orderId) {
    const foundOrderItems = await this.orderItemRepository.findAllByOrderId(
      orderId
    );
    return foundOrderItems;
  }

  async getOrderItemsByProductId(productId) {
    const foundOrderItems = await this.orderItemRepository.findAllByProductId(
      productId
    );
    return foundOrderItems;
  }

  async setOrderItem(orderItemId, updateInfo) {
    const updatedOrderItem = await this.orderItemRepository.update({
      orderItemId,
      updateInfo,
    });
    return updatedOrderItem;
  }

  async removeOrderItemById(orderItemId) {
    const { deletedCount } = await this.orderItemRepository.deleteById(
      orderItemId
    );
    if (deletedCount === 0) {
      throw new Error(`${orderItemId} 품목의 삭제에 실패하였습니다`);
    }
    return { result: "success" };
  }
}

const orderItemService = new OrderItemService(orderItemRepository);

export { orderItemService };
