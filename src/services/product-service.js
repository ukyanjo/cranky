import { productRepository, categoryRepository } from "../repositories";

class ProductService {
  constructor(productRepository, categoryRepository) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  async addProduct(productInfo) {
    const { title } = productInfo;
    const foundProduct = await this.productRepository.findByTitle(title);
    if (foundProduct) {
      throw new Error(
        "이 이름은 현재 사용중입니다. 다른 이름을 입력해 주세요."
      );
    }
    const createdProduct = await this.productRepository.create(productInfo);
    console.log("this done");
    return createdProduct;
  }

  async getProductById(productId) {
    const foundProduct = await this.productRepository.findById(productId);
    if (!foundProduct) {
      throw new Error("해당 id의 제품은 없습니다. 다시 한 번 확인해 주세요.");
    }
    return foundProduct;
  }

  async getAllProducts() {
    const foundProducts = await this.productRepository.findAll();
    return foundProducts;
  }

  async getProductsByCategoryTitle(categoryTitle) {
    const foundCategory = await this.categoryRepository.findByTitle(
      categoryTitle
    );
    const foundProducts = await this.productRepository.findAllByCategoryId(
      foundCategory._id
    );

    return foundProducts;
  }

  async setProduct(productId, updateInfo) {
    const updatedProduct = await this.productRepository.update({
      productId,
      updateInfo,
    });
    return updatedProduct;
  }

  async removeProductById(productId) {
    const { deletedCount } = await this.productRepository.deleteById(productId);
    if (deletedCount === 0) {
      throw new Error(`${productId} 제품의 삭제에 실패하였습니다`);
    }
    return { result: "success" };
  }
}

const productService = new ProductService(
  productRepository,
  categoryRepository
);

export { productService };
