import Joi from "joi";

export const CategoryValidation = {
    createCategory: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        description: Joi.string().max(500).optional().allow(""),
        cover: Joi.string().uri().optional(),
    }),
}