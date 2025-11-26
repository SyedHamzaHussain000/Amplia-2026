import { Request } from "express";

export const createProfileUrl = (req: Request): string => {
     if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        return `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (req.body.profile && typeof req.body.profile === "string") {
        return req.body.profile;
    }

    return "";
};