import { Router } from "express";
import { adminOnly, loginRequired } from "../middlewares";
import { categoryService } from "../services";

const categoryRouter = Router();

//api done
categoryRouter.post("/category", adminOnly, async (req, res, next) => {
  try {
    const { title, description, imageKey } = req.body;
    const categoryInfo = { title, description, imageKey };
    const createdCategory = await categoryService.addCategory(categoryInfo);
    res.status(201).json(createdCategory);
  } catch (error) {
    next(error);
  }
});

//api done
categoryRouter.get("/categorylist", async function (req, res, next) {
  try {
    const foundCategorys = await categoryService.getCategorys();
    res.status(200).json(foundCategorys);
  } catch (error) {
    next(error);
  }
});

//api done
categoryRouter.get(
  "/categorys/:categoryId",
  loginRequired,
  async function (req, res, next) {
    try {
      const { categoryId } = req.params;
      const foundCategory = await categoryService.getCategoryById(categoryId);
      res.status(200).json(foundCategory);
    } catch (error) {
      next(error);
    }
  }
);

// api done
categoryRouter.patch(
  "/categorys/:categoryId",
  adminOnly,
  async function (req, res, next) {
    try {
      const { categoryId } = req.params;
      const { title, description, imageKey } = req.body;
      // const updateInfo = {
      //   title,
      //   description,
      //   imageKey,
      // };
      const updateInfo = {
        ...(title && { title }),
        ...(description && { description }),
        ...(imageKey && { imageKey }),
      };
      const updatedCategory = await categoryService.setCategory(
        categoryId,
        updateInfo
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }
);

//api done
categoryRouter.delete(
  "/categorys/:categoryId",
  adminOnly,
  async function (req, res, next) {
    try {
      const { categoryId } = req.params;
      const deleteResult = await categoryService.removeCategoryById(categoryId);
      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

export { categoryRouter };
