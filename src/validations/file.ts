import Joi from "joi";

export const FileValidation = {
    add: Joi.object({
        name: Joi.string().required(),
        year: Joi.number().integer().required(),
    }),
    update: Joi.object({
        name: Joi.string().optional().min(1),
        year: Joi.number().integer().optional(),
    }),
}