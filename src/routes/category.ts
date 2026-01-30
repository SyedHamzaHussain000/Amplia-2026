import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import upload from "../middleware/multerConfig";
import { validate } from "../middleware/validate";
import { CategoryController } from "../controllers/category";
import { CategoryValidation } from "../validations/category";

const router = Router()

router.route('/')
    .post(IsAuth.everyone, upload.fields([{ name: "cover", maxCount: 1 }, { name: "icon", maxCount: 1 }]), CategoryController.createCategory)
    .get(IsAuth.everyone, CategoryController.getCategory)

router.route('/:id')
    .patch(IsAuth.everyone, upload.fields([{ name: "cover", maxCount: 1 }, { name: "icon", maxCount: 1 }]), CategoryController.updateCategory)
    .delete(IsAuth.everyone, CategoryController.deleteCategory)
    .get(IsAuth.everyone, CategoryController.getCategory)

export default router
