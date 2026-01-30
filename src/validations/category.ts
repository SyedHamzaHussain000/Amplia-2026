import Joi from "joi";

export const CategoryValidation = {
    createCategory: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        description: Joi.string().max(500).optional().allow(""),
        icon: Joi.any().optional(),
        cover: Joi.any().optional(),
    }),
    updateCategory: Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        description: Joi.string().max(500).optional().allow(""),
        icon: Joi.any().optional(),
        cover: Joi.any().optional(),
    }),
}