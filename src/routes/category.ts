import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import upload from "../middleware/multerConfig";
import { validate } from "../middleware/validate";
import { CategoryController } from "../controllers/category";
import { CategoryValidation } from "../validations/category";

const router = Router()

router.route('/')
    .post(IsAuth.superAdmin, upload.single("cover"),
        validate(CategoryValidation.createCategory), CategoryController.createCategory)
    .get(IsAuth.everyone, CategoryController.getCategory)

router.route('/:id')
    .patch(IsAuth.superAdmin, upload.single("cover"), CategoryController.updateCategory)
    .delete(IsAuth.superAdmin, CategoryController.deleteCategory)
    .get(IsAuth.everyone, CategoryController.getCategory)

export default router
