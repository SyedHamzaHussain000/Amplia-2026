import Joi from "joi";
import { SubAdminStatus } from "../constants/roles";

export const SubAdminValidation = {
    createSubAdmin: Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).optional().allow(""),
        email: Joi.string().email().required(),
        companyName: Joi.string().min(2).max(100).optional().allow(""),
        password: Joi.string().min(6).required(),
        profile: Joi.string().optional().allow(""),
        status: Joi.string().valid(...Object.values(SubAdminStatus)).required()
    }),
    updateSubAdmin: Joi.object({
        firstName: Joi.string().min(2).max(50).optional(),
        lastName: Joi.string().min(2).max(50).optional().allow(""),
        companyName: Joi.string().min(2).max(100).optional().allow(""),
        status: Joi.string().valid(...Object.values(SubAdminStatus)).optional(),
    }),
}