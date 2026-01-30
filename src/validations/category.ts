import Joi from "joi";

export const CategoryValidation = {
    createCategory: Joi.object({}).unknown(true),
    updateCategory: Joi.object({}).unknown(true),
}