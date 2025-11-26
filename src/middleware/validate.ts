import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                errors: error.details.map(d => d.message).join(", "),
            });
        }
        req.body = value;
        next();
    };
};
