import { Request } from "express";
import { createUploadUrl } from "./createUploadUrl";

export const createProfileUrl = (req: Request): string => {
    if (req.file) return createUploadUrl(req, req.file);

    if (req.body.profile && typeof req.body.profile === "string") {
        return req.body.profile;
    }

    return "";
};