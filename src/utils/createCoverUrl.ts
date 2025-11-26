import { Request } from "express";

export const createCoverUrl = (req: Request): string => {
    if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        return `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (req.body.cover && typeof req.body.cover === "string") {
        return req.body.cover;
    }

    return "";
};