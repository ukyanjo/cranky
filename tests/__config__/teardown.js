import mongoose from "mongoose";

export default async function () {
  const connection = mongoose.createConnection(process.env["MONGODB_URL"]);

  await connection.dropCollection("users");
  await connection.dropCollection("categorys");
  await connection.dropCollection("products");
  await connection.dropCollection("orders");
  await connection.dropCollection("order-items");

  await connection.close();
}
