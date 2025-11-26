// validations/ratingValidation.ts
import Joi from "joi";

export const RatingValidation = {
    createRating: Joi.object({
        service: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        review: Joi.string().min(5).max(500).required()
    }),
    updateRating: Joi.object({
        rating: Joi.number().min(1).max(5),
        review: Joi.string().min(1).max(500),
    }).or("rating", "review")
};
