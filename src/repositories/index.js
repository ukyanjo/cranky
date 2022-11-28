import mongoose from "mongoose";

const DB_URL =
  process.env.MONGODB_URL ||
  "MongoDB 주소가 설정되지 않았습니다.\n.env 파일을 확인해주세요.";

mongoose.connect(DB_URL);

const db = mongoose.connection;

db.on("connected", () => {
  return console.log("MongoDB 연결에 성공했습니다.  ");
});
db.on("error", (error) => {
  return console.error("MongoDB 연결에 실패했습니다.");
});

export * from "./user.repository";
export * from "./category.repository";
export * from "./product.repository";
export * from "./order.repository";
export * from "./order-item.repository";
