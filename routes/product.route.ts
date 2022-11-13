import { Router } from "express";

import { protect } from "../middlewares/protect";
import {
  getAllProducts,
  getProductByID,
} from "../controllers/product.controller";

const productRouter = Router();
productRouter.use(protect);

productRouter.get("/", getAllProducts);
productRouter.get("/:productId", getProductByID);

export default productRouter;
