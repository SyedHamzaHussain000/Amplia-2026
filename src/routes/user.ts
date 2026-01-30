import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { UserController } from "../controllers/user";
import { validate } from "../middleware/validate";
import { UserValidation } from "../validations/user";
import upload from "../middleware/multerConfig";

const router = Router()

router.route('/')
    .get(IsAuth.everyone, UserController.get)
    .patch(IsAuth.everyone, upload.single("profile"), validate(UserValidation.update), UserController.update)
    .delete(IsAuth.everyone, UserController.delete)

router.post('/updatePassword', IsAuth.everyone, validate(UserValidation.updatePassword), UserController.updatePassword)

export default router