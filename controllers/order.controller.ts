import { Request, Response } from "express";

import { pool } from "../databases/database";
import {
  getAllOrderHistoryFromDb,
  createOrderId,
  makeAnOrdertoDb,
  deleteAnOrderFromDb,
} from "../databases/order.db";

const getAllOrderHistory = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await getAllOrderHistoryFromDb(userId);

  return res.status(200).json({ data: result.rows });
};

const makeAnOrder = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const allProducts = req.body;

  const orderId = await createOrderId(userId);

  for (let { productId, amount } of allProducts) {
    await makeAnOrdertoDb(+productId, +orderId, +amount);
  }

  return res.status(200).json({ message: "Make an order successfully" });
};

const cancelOrderByID = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  await deleteAnOrderFromDb(orderId);

  return res
    .status(200)
    .json({ message: `The ${orderId} has been canceled successfully` });
};

export { getAllOrderHistory, makeAnOrder, cancelOrderByID };
