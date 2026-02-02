import { Request } from "express";
import { createUploadUrl } from "./createUploadUrl";
import { getFilenameFromUrl } from "./getFilenameFromUrl";

export const createCoverUrl = (req: Request): string => {
    // Handle multiple files (upload.fields)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files && files.cover && files.cover[0]) {
        return createUploadUrl(req, files.cover[0]);
    }

    // Handle single file (upload.single)
    if (req.file && req.file.fieldname === "cover") {
        return createUploadUrl(req, req.file);
    }

    if (req.body.cover && typeof req.body.cover === "string") {
        return getFilenameFromUrl(req.body.cover);
    }

    return "";
};