import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(`[Validation Middleware] Body:`, JSON.stringify(req.body, null, 2));
        console.log(`[Validation Middleware] File:`, req.file ? `File present: ${req.file.fieldname}` : "No file present");
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
