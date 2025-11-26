import Joi from "joi";

export const AuthValidation = {
    signupRequestOtp: Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).optional().allow(""),
        email: Joi.string().email().required(),
        companyName: Joi.string().min(2).max(100).optional().allow(""),
        password: Joi.string().min(6).required(),
        profile: Joi.string().optional().allow(""),
    }),
    signupVerifyOtp: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.alternatives(Joi.string().length(4), Joi.number().min(1000).max(9999)).required(),
    }),
    resendOtp: Joi.object({ email: Joi.string().email().required() }),
    signin: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    forgotPass: Joi.object({
        email: Joi.string().email().required(),
    }),
    verifyOtp: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.alternatives(Joi.string().length(4), Joi.number().min(1000).max(9999)).required(),
    }),
    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().min(6).required(),
    }),
}
