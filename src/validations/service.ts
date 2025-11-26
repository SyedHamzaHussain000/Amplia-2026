import Joi from "joi";

export const ServiceValidation = {
    createService: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        category: Joi.string().required(),
        description: Joi.string().max(500).optional().allow(""),
        cover: Joi.string().uri().optional(),
        plans: Joi.alternatives().try(
            Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().min(0).required(),
                    description: Joi.string().optional().allow(""),
                })), Joi.string()).required(),
        isActive: Joi.boolean().optional().messages({
            "array.base": "Plans must be an array",
            "array.min": "At least one plan is required",
            "any.required": "Plans are required",
        })
    }),
    updateService: Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        category: Joi.string().optional(),
        description: Joi.string().max(500).optional().allow(""),
        cover: Joi.string().uri().optional(),
        plans: Joi.alternatives().try(
            Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().min(0).required(),
                    description: Joi.string().optional().allow(""),
                })
            ),
            Joi.string()
        ).optional(),
        isActive: Joi.boolean().optional(),
    }),
}