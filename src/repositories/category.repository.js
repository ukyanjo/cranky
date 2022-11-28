import { model } from "mongoose";
import { CategorySchema } from "./schemas";

const Category = model("categorys", CategorySchema);

export class CategoryRepository {
  async create(categoryInfo) {
    const createdCategory = await Category.create(categoryInfo);
    return createdCategory;
  }

  async findByTitle(title) {
    const foundCategory = await Category.findOne({ title });
    return foundCategory;
  }

  async findById(categoryId) {
    const foundCategory = await Category.findOne({ _id: categoryId });
    return foundCategory;
  }

  async findAll() {
    const foundCategorys = await Category.find({});
    return foundCategorys;
  }

  async update({ categoryId, updateInfo }) {
    const filter = { _id: categoryId };
    const option = { returnOriginal: false };

    const updatedCategory = await Category.findOneAndUpdate(
      filter,
      updateInfo,
      option
    );
    return updatedCategory;
  }

  async deleteById(categoryId) {
    const result = await Category.deleteOne({ _id: categoryId });
    return result;
  }
}

const categoryRepository = new CategoryRepository();

export { categoryRepository };
