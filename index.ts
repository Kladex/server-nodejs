import express, { Express, Request, Response } from "express";
import cors from "cors";

import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import orderRouter from "./routes/order.route";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();

const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use("/user", authRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);

app.get("*", (req: Request, res: Response) => {
  res.status(404).send("Not found this API");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
