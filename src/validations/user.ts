import Joi from "joi";

export const UserValidation = {
    update: Joi.object({
        firstName: Joi.string().min(2).max(50).optional(),
        lastName: Joi.string().min(2).max(50).optional().allow(""),
        companyName: Joi.string().min(2).max(100).optional().allow(""),
        profile: Joi.string().optional().allow("")
    }),
    updatePassword: Joi.object({
        currentPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required(),
        confirmNewPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
            "any.only": "Confirm password must match new password"
        })
    })
}