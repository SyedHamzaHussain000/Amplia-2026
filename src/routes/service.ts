import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import upload from "../middleware/multerConfig";
import { ServiceController } from "../controllers/service";
import { validate } from "../middleware/validate";
import { ServiceValidation } from "../validations/service";


const router = Router()

router.route('/')
    .post(IsAuth.everyone, upload.single("cover"), ServiceController.createService)
    .get(IsAuth.everyone, ServiceController.getService)

router.route('/:id')
    .patch(IsAuth.everyone, upload.single("cover"), ServiceController.updateService)

    .delete(IsAuth.everyone, ServiceController.deleteService)
    .get(IsAuth.everyone, ServiceController.getService)

export default router
