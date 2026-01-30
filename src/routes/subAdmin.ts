import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import upload from "../middleware/multerConfig";
import { validate } from "../middleware/validate";
import { SubAdminValidation } from "../validations/subAdmin";
import { SubAdminController } from "../controllers/SubAdmin";

const router = Router()

router.route('/')
    .post(IsAuth.superAdmin, upload.single("profile"), SubAdminController.createSubAdmin)
    .get(IsAuth.everyone, SubAdminController.getSubAdmins)

router.route('/:id')
    .patch(IsAuth.admins, upload.single("profile"), SubAdminController.updateSubAdmin)
    .delete(IsAuth.superAdmin, SubAdminController.deleteSubAdmin)
    .get(IsAuth.admins, SubAdminController.getSubAdmins)

export default router
