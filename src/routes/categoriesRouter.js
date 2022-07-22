import { Router } from "express";
import { getCategories, createCategory } from '../controllers/categoriesController.js'
import validateCategory from "../middlewares/validateCategory.js";

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', validateCategory, createCategory);

export default router;