import Joi from "joi";
import { ChatStatus } from "../constants/roles";

export const ChatValidation = {
    updateStatus: Joi.object({
        status: Joi.string()
            .valid(ChatStatus.ACTIVE, ChatStatus.RESOLVED).required(),
    }),
    sendMessage: Joi.object({
        message: Joi.string().allow("").optional(),
        media: Joi.array().items(Joi.string().uri()).optional(),
        files: Joi.array().items(Joi.string().uri()).optional(),
    }).custom((value, helpers) => {
        if (!value.message && (!value.media || value.media.length === 0) && (!value.files || value.files.length === 0)) {
            return helpers.message({ custom: "At least one of message, media, or files is required" });
        }
        return value;
    })
}