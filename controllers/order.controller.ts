import { Request, Response } from "express";
import { pool } from "../databases/database";

const getAllOrderHistory = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await pool.query(
    `select order_id, product_id, product_name, price, amount
    from orders
    left join order_detail using(order_id)
    left join products using(product_id)
    where user_id = $1`,
    [userId]
  );

  return res.status(200).json({ data: result.rows });
};

const makeAnOrder = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const allProducts = req.body;

  const result = await pool.query(
    `insert into orders (user_id, created_at) values ($1, $2) returning order_id`,
    [userId, new Date()]
  );
  const orderId = result.rows[0].order_id;

  for (let { productId, amount } of allProducts) {
    await pool.query(
      `insert into order_detail (product_id, order_id, amount) values ($1, $2, $3)`,
      [+productId, +orderId, +amount]
    );
  }

  return res.status(200).json({ message: "Make an order successfully" });
};

const cancelOrderByID = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  await pool.query("delete from orders where order_id=$1", [orderId]);

  return res
    .status(200)
    .json({ message: `The ${orderId} has been canceled successfully` });
};

export { getAllOrderHistory, makeAnOrder, cancelOrderByID };
