import Joi from "joi";
import { BookingStatus } from "../constants/roles";

export const BookingValidation = {
    create: Joi.object({
        service: Joi.string().required(),
        planName: Joi.string().required(),
        status: Joi.string()
            .valid(...Object.values([BookingStatus.NEW, BookingStatus.SCHEDULED]))
            .required(),
        scheduledDate: Joi.when("status", {
            is: BookingStatus.SCHEDULED,
            then: Joi.date().required(),
            otherwise: Joi.date().optional().allow(null),
        }),
    }),
    updateStatus: Joi.object({
        status: Joi.string()
            .valid(...Object.values([BookingStatus.ACTIVE, BookingStatus.COMPLETED])).required(),
    }),
}