import { pool } from "./database";

const getAllOrderHistoryFromDb = async (userId: string) => {
  const result = await pool.query(
    `select order_id, product_id, product_name, price, amount
        from orders
        left join order_detail using(order_id)
        left join products using(product_id)
        where user_id = $1`,
    [userId]
  );

  return result;
};

const createOrderId = async (userId: string) => {
  const result = await pool.query(
    `insert into orders (user_id, created_at) values ($1, $2) returning order_id`,
    [userId, new Date()]
  );
  const orderId = result.rows[0].order_id;

  return orderId;
};

const makeAnOrdertoDb = async (
  productId: number,
  orderId: number,
  amount: number
) => {
  await pool.query(
    `insert into order_detail (product_id, order_id, amount) values ($1, $2, $3)`,
    [productId, orderId, amount]
  );
};

const deleteAnOrderFromDb = async (orderId: string) => {
  await pool.query("delete from orders where order_id=$1", [orderId]);
};

export {
  getAllOrderHistoryFromDb,
  createOrderId,
  makeAnOrdertoDb,
  deleteAnOrderFromDb,
};
