import { Router } from "express";
import { adminOnly, loginRequired } from "../middlewares";
import { orderItemService } from "../services";

const orderItemRouter = Router();

orderItemRouter.post("/orderitem", loginRequired, async (req, res, next) => {
  try {
    const { orderId, productId, quantity, totalPrice } = req.body;
    const orderItemInfo = {
      ...(orderId && { orderId }),
      ...(productId && { productId }),
      ...(quantity && { quantity }),
      ...(totalPrice && { totalPrice }),
    };
    const createdOrderItem = await orderItemService.addOrderItem(orderItemInfo);
    res.status(201).json(createdOrderItem);
  } catch (error) {
    next(error);
  }
});

orderItemRouter.get(
  "/orderitemlist/all",
  adminOnly,
  async function (req, res, next) {
    try {
      const foundOrderItems = await orderItemService.getAllOrderItems();
      res.status(200).json(foundOrderItems);
    } catch (error) {
      next(error);
    }
  }
);

orderItemRouter.get(
  "/orderitemlist/order/:orderId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderId } = req.params;
      const foundOrderItems = await orderItemService.getOrderItemsByOrderId(
        orderId
      );
      res.status(200).json(foundOrderItems);
    } catch (error) {
      next(error);
    }
  }
);

orderItemRouter.get(
  "/orderitemlist/product/:productId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { productId } = req.params;
      const foundOrderItems = await orderItemService.getOrderItemsByProductId(
        productId
      );
      res.status(200).json(foundOrderItems);
    } catch (error) {
      next(error);
    }
  }
);

orderItemRouter.get(
  "/orderitems/:orderItemId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderItemId } = req.params;
      const foundOrderItem = await orderItemService.getOrderItemById(
        orderItemId
      );
      res.status(200).json(foundOrderItem);
    } catch (error) {
      next(error);
    }
  }
);

orderItemRouter.patch(
  "/orderitems/:orderItemId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderItemId } = req.params;
      const { quantity, totalPrice, status } = req.body;
      const updateInfo = {
        ...(quantity && { quantity }),
        ...(totalPrice && { totalPrice }),
        ...(status && { status }),
      };
      const updatedOrderItem = await orderItemService.setOrderItem(
        orderItemId,
        updateInfo
      );
      res.status(200).json(updatedOrderItem);
    } catch (error) {
      next(error);
    }
  }
);

orderItemRouter.delete(
  "/orderitems/:orderItemId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderItemId } = req.params;
      const deleteResult = await orderItemService.removeOrderItemById(
        orderItemId
      );
      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

export { orderItemRouter };
