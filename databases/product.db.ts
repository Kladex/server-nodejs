import { pool } from "./database";

const getAllproductFromDb = async (limit: any, offset: number) => {
  const data = await pool.query("select * from products limit $1 offset $2", [
    limit,
    offset,
  ]);

  return data;
};

const getProductByIDFromDb = async (productId: string) => {
  const data = await pool.query("select * from products where product_id=$1", [
    productId,
  ]);

  return data;
};

export { getAllproductFromDb, getProductByIDFromDb };
