import { Router } from "express";
import { adminOnly, loginRequired } from "../middlewares";
import { orderItemService } from "../services";

const orderItemRouter = Router();

// api done
orderItemRouter.post("/orderitem", loginRequired, async (req, res, next) => {
  try {
    const { orderId, productId, quantity, totalPrice } = req.body;
    const orderItemInfo = { orderId, productId, quantity, totalPrice };
    const createdOrderItem = await orderItemService.addOrderItem(orderItemInfo);
    res.status(201).json(createdOrderItem);
  } catch (error) {
    next(error);
  }
});

// api done
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

// api done
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

// api done, 이건 왜 있지?
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

//api done
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

//api done
orderItemRouter.patch(
  "/orderitems/:orderItemId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderItemId } = req.params;
      const { quantity, totalPrice, status } = req.body;
      // const updateInfo = { quantity, totalPrice, status };
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

//api done
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
