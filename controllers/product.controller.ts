import { Request, Response } from "express";

import {
  getAllproductFromDb,
  getProductByIDFromDb,
} from "../databases/product.db";

const getAllProducts = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  let offset = (+page - 1) * +limit;

  const data = await getAllproductFromDb(limit, offset);

  const allProducts = data.rows;
  const hasProduct = allProducts.length;

  if (hasProduct) {
    return res.status(200).json({ data: allProducts });
  } else {
    return res.status(503).json({ message: `No products` });
  }
};

const getProductByID = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const data = await getProductByIDFromDb(productId);

  const hasProduct = data.rows.length;
  const productByID = data.rows;

  if (hasProduct) {
    return res.status(200).json({ data: productByID });
  } else {
    return res.status(503).json({ message: `No productID ${productId}` });
  }
};

export { getAllProducts, getProductByID };
