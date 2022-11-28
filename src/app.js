import cors from "cors";
import express from "express";
import {
  viewsRouter,
  userRouter,
  categoryRouter,
  productRouter,
  orderRouter,
  orderItemRouter,
} from "./routers";
import { errorLogger, errorHandler } from "./middlewares";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(viewsRouter);

app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", orderRouter);
app.use("/api", orderItemRouter);

app.use(errorLogger);
app.use(errorHandler);

export { app };
