import { Request } from "express";
import { createUploadUrl } from "./createUploadUrl";

export const createCoverUrl = (req: Request): string => {
    if (req.file) return createUploadUrl(req, req.file);

    if (req.body.cover && typeof req.body.cover === "string") {
        return req.body.cover;
    }

    return "";
};