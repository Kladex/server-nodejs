import { Router } from "express";

import { protect } from "../middlewares/protect";
import {
  getAllOrderHistory,
  makeAnOrder,
  cancelOrderByID,
} from "../controllers/order.controller";

const orderRouter = Router();
orderRouter.use(protect);

orderRouter.get("/:userId", getAllOrderHistory);
orderRouter.post("/:userId", makeAnOrder);
orderRouter.delete("/:orderId", cancelOrderByID);

export default orderRouter;
