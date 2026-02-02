import Joi from "joi";
import { BookingStatus } from "../constants/roles";

export const BookingValidation = {
    create: Joi.object({
        service: Joi.string().required(),
        planName: Joi.string().required(),
        status: Joi.string()
            .valid(...Object.values([BookingStatus.NEW, BookingStatus.SCHEDULED]))
            .required(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional(),
    }),
    updateStatus: Joi.object({
        status: Joi.string()
            .valid(...Object.values([BookingStatus.ACTIVE, BookingStatus.COMPLETED])).required(),
    }),
}