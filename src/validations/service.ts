import Joi from 'joi';

export const ServiceValidation = {
    // Validations removed as requested by user for more flexible data handling
    createService: Joi.object({}).unknown(true),
    updateService: Joi.object({}).unknown(true),
};