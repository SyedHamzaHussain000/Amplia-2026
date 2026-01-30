import Joi from "joi";
import { SubAdminStatus, UserRole } from "../constants/roles";

export const SubAdminValidation = {
    createSubAdmin: Joi.object({
        firstName: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid(UserRole.SUB_ADMIN).optional(),
        status: Joi.string().valid(...Object.values(SubAdminStatus)).required(),
        profile: Joi.any().optional(),
    }),
    updateSubAdmin: Joi.object({
        firstName: Joi.string().min(2).max(100).optional(),
        email: Joi.string().email().optional(),
        status: Joi.string().valid(...Object.values(SubAdminStatus)).optional(),
        role: Joi.string().valid(UserRole.SUB_ADMIN).optional(),
        profile: Joi.any().optional(),
    }),
}