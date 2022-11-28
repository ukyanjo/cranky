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
      throw new Error("현재 사용중인 이름입니다. 다른 이름을 입력해주세요.");
    }
    const createdProduct = await this.productRepository.create(productInfo);
    console.log("this done");
    return createdProduct;
  }

  async getProductById(productId) {
    const foundProduct = await this.productRepository.findById(productId);
    if (!foundProduct) {
      throw new Error(
        "해당 id의 제품을 찾지 못했습니다. 다시 한 번 확인해주세요."
      );
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
      throw new Error(`${productId} 제품을 삭제하지 못했습니다.`);
    }
    return { result: "success" };
  }
}

const productService = new ProductService(
  productRepository,
  categoryRepository
);

export { productService };
