import { categoryRepository, productRepository } from "../repositories";

class CategoryService {
  constructor(categoryRepository, productRepository) {
    this.categoryRepository = categoryRepository;
    this.productRepository = productRepository;
  }

  async addCategory(categoryInfo) {
    const { title } = categoryInfo;
    const foundCategory = await this.categoryRepository.findByTitle(title);
    if (foundCategory) {
      throw new Error(
        "이 이름은 현재 사용중입니다. 다른 이름을 입력해 주세요."
      );
    }
    const createdCategory = await this.categoryRepository.create(categoryInfo);

    return createdCategory;
  }

  async getCategorys() {
    const foundCategorys = await this.categoryRepository.findAll();
    return foundCategorys;
  }

  async setCategory(categoryId, updateInfo) {
    const updatedCategory = await this.categoryRepository.update({
      categoryId,
      updateInfo,
    });
    return updatedCategory;
  }

  async getCategoryById(categoryId) {
    const foundCategory = await this.categoryRepository.findById(categoryId);
    if (!foundCategory) {
      throw new Error(
        "해당 id의 카테고리는 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    return foundCategory;
  }

  async getCategoryByTitle(categoryTitle) {
    const foundCategory = await this.categoryRepository.findByTitle(
      categoryTitle
    );
    if (!foundCategory) {
      throw new Error(
        "해당 이름의 카테고리는 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    return foundCategory;
  }

  async removeCategoryById(categoryId) {
    const foundProduct = await this.productRepository.findOneByCategoryId(
      categoryId
    );
    if (foundProduct) {
      throw new Error("카테고리 속한 제품이 있습니다.");
    }
    const { deletedCount } = await this.categoryRepository.deleteById(
      categoryId
    );
    if (deletedCount === 0) {
      throw new Error(`${categoryId} 카테고리의 삭제에 실패하였습니다`);
    }
    return { result: "success" };
  }
}

const categoryService = new CategoryService(
  categoryRepository,
  productRepository
);

export { categoryService };
