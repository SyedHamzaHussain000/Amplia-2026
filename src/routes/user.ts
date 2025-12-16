import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { UserController } from "../controllers/user";
import { validate } from "../middleware/validate";
import { UserValidation } from "../validations/user";
import upload from "../middleware/multerConfig";

const router = Router()

router.route('/')
    .get(IsAuth.users, UserController.get)
    .patch(IsAuth.users, upload.single("profile"), validate(UserValidation.update), UserController.update)
    .delete(IsAuth.users, UserController.delete)

router.post('/updatePassword', IsAuth.users, validate(UserValidation.updatePassword), UserController.updatePassword)

export default router