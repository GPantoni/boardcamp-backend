import { Router } from "express";
import {
  listCategories,
  insertCategory,
} from "../controllers/categoryController.js";
import { validateNCheckCategory } from "../middlewares/validateNCheckCategory.js";

const categoryRouter = Router();

categoryRouter.get("/categories", listCategories);
categoryRouter.post("/categories", validateNCheckCategory, insertCategory);

export default categoryRouter;
