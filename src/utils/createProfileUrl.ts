import { Request } from "express";
import { createUploadUrl } from "./createUploadUrl";
import { getFilenameFromUrl } from "./getFilenameFromUrl";

export const createProfileUrl = (req: Request): string => {
    if (req.file) return createUploadUrl(req, req.file);

    if (req.body.profile && typeof req.body.profile === "string") {
        return getFilenameFromUrl(req.body.profile);
    }

    return "";
};