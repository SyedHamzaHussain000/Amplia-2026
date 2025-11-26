import { Router } from "express";
import upload from "../middleware/multerConfig";
import { validate } from "../middleware/validate";
import { AuthController } from "../controllers/auth";
import { AuthValidation } from "../validations/auth";

const router = Router()

router.post('/signup/requestOtp', upload.single("profile"),
    validate(AuthValidation.signupRequestOtp), AuthController.signupRequestOtp)

router.post('/signup/verifyOtp', validate(AuthValidation.signupVerifyOtp), AuthController.signupVerifyOtp)
router.post('/signup/resendOtp', validate(AuthValidation.resendOtp), AuthController.signupResendOtp)
router.post('/signin', validate(AuthValidation.signin), AuthController.signin)

router.post('/fotgotPassword', validate(AuthValidation.forgotPass), AuthController.fotgotPassword)
router.post('/verifyOtp', validate(AuthValidation.verifyOtp), AuthController.verifyOtp)
router.post('/resetPassword', validate(AuthValidation.resetPassword), AuthController.resetPassword)

export default router
