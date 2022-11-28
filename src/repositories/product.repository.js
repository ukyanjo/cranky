import { model } from "mongoose";
import { ProductSchema } from "./schemas";

const Product = model("products", ProductSchema);

export class ProductRepository {
  async create(productInfo) {
    const createdProduct = await Product.create(productInfo);
    return createdProduct;
  }

  async findByTitle(title) {
    const foundProduct = await Product.findOne({ title });
    return foundProduct;
  }

  async findById(productId) {
    const foundProduct = await Product.findOne({ _id: productId });
    return foundProduct;
  }

  async findOneByCategoryId(categoryId) {
    const foundProduct = await Product.findOne({ categoryId });
    return foundProduct;
  }

  async findAllByCategoryId(categoryId) {
    const foundProducts = await Product.find({ categoryId });
    return foundProducts;
  }

  async findAll() {
    const foundProducts = await Product.find({});
    return foundProducts;
  }

  async update({ productId, updateInfo }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };
    console.log(filter, updateInfo);
    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      updateInfo,
      option
    );
    return updatedProduct;
  }

  async deleteById(productId) {
    const result = await Product.deleteOne({ _id: productId });
    return result;
  }
}

const productRepository = new ProductRepository();

export { productRepository };
