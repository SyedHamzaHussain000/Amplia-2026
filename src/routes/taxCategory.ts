import { Router } from "express";
import { TaxCategoryController } from "../controllers/taxCategory";
import { IsAuth } from "../middleware/isAuth";

const router = Router();

// Public/User routes
router.get("/", TaxCategoryController.getAll);
router.post("/calculate", TaxCategoryController.calculate);

// Admin routes
router.post("/", IsAuth.admins, TaxCategoryController.create);
router.put("/:id", IsAuth.admins, TaxCategoryController.update);
router.delete("/:id", IsAuth.admins, TaxCategoryController.delete);

export default router;
