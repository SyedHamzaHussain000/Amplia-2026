import Joi from "joi";

export const SubAdminValidation = {
    createSubAdmin: Joi.object({}).unknown(true),
    updateSubAdmin: Joi.object({}).unknown(true),
}