import { Router } from "express";
import { adminOnly, loginRequired } from "../middlewares";
import { orderService } from "../services";

const orderRouter = Router();

orderRouter.post("/order", loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const { totalPrice, address, request } = req.body;
    const orderInfo = {
      ...(userId && { userId }),
      ...(totalPrice && { totalPrice }),
      ...(address && { address }),
      ...(request && { request }),
    };
    const createdOrder = await orderService.addOrder(orderInfo);
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
});

orderRouter.get("/orderlist/all", adminOnly, async function (req, res, next) {
  try {
    const foundOrders = await orderService.getAllOrders();
    res.status(200).json(foundOrders);
  } catch (error) {
    next(error);
  }
});

orderRouter.get(
  "/orderlist/user",
  loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const foundOrders = await orderService.getOrdersByUserId(userId);
      res.status(200).json(foundOrders);
    } catch (error) {
      next(error);
    }
  }
);

orderRouter.get(
  "/orders/:orderId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderId } = req.params;
      const foundOrder = await orderService.getOrderById(orderId);
      res.status(200).json(foundOrder);
    } catch (error) {
      next(error);
    }
  }
);

orderRouter.patch(
  "/orders/:orderId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderId } = req.params;
      const { address, request, status } = req.body;
      const updateInfo = {
        ...(address && { address }),
        ...(request && { request }),
        ...(status && { status }),
      };
      const updatedOrder = await orderService.setOrder(orderId, updateInfo);
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }
);

orderRouter.delete(
  "/orders/:orderId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderId } = req.params;
      const deleteResult = await orderService.removeOrderById(orderId);
      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

export { orderRouter };
