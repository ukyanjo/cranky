import { Router } from "express";
import { loginRequired } from "../middlewares";
import { productService } from "../services";

const productRouter = Router();

//api done
productRouter.post("/product", loginRequired, async (req, res, next) => {
  try {
    const {
      title,
      categoryId,
      sellerId,
      manufacturer,
      shortDescription,
      imageKey,
      inventory,
      price,
      searchKeywords,
      discountRate,
    } = req.body;
    const productInfo = {
      title,
      categoryId,
      sellerId,
      manufacturer,
      shortDescription,
      imageKey,
      inventory,
      price,
      searchKeywords,
      discountRate,
    };
    const createdProduct = await productService.addProduct(productInfo);
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
});

//api done
productRouter.get(
  "/productlist",
  loginRequired,
  async function (req, res, next) {
    try {
      const foundProducts = await productService.getAllProducts();
      res.status(200).json(foundProducts);
    } catch (error) {
      next(error);
    }
  }
);

//api done
productRouter.get(
  "/productlist/category/:categoryTitle",
  async function (req, res, next) {
    let { categoryTitle } = req.params;
    try {
      const foundProducts = await productService.getProductsByCategoryTitle(
        categoryTitle
      );
      res.status(200).json(foundProducts);
    } catch (error) {
      next(error);
    }
  }
);

//adpi done
productRouter.get("/products/:productId", async function (req, res, next) {
  try {
    const { productId } = req.params;
    const foundProduct = await productService.getProductById(productId);
    res.status(200).json(foundProduct);
  } catch (error) {
    next(error);
  }
});

//api done
productRouter.patch(
  "/products/:productId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { productId } = req.params;
      const {
        title,
        shortDescription,
        imageKey,
        inventory,
        price,
        searchKeywords,
        discountRate,
      } = req.body;
      // const updateInfo = {
      //   productId,
      //   title,
      //   shortDescription,
      //   imageKey,
      //   inventory,
      //   price,
      //   searchKeywords,
      //   discountRate,
      // };
      const updateInfo = {
        ...(title && { title }),
        ...(shortDescription && { shortDescription }),
        ...(imageKey && { imageKey }),
        ...(inventory && { inventory }),
        ...(price && { price }),
        ...(searchKeywords && { searchKeywords }),
        ...(discountRate && { discountRate }),
      };
      const updatedProduct = await productService.setProduct(
        productId,
        updateInfo
      );
      console.log(updatedProduct);
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
);

//api done
productRouter.delete(
  "/products/:productId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { productId } = req.params;
      const deleteResult = await productService.removeProductById(productId);
      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

export { productRouter };
