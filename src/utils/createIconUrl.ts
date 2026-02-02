import { Request } from "express";
import { createUploadUrl } from "./createUploadUrl";
import { getFilenameFromUrl } from "./getFilenameFromUrl";

export const createIconUrl = (req: Request): string => {
    // Handle multiple files (upload.fields)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files && files.icon && files.icon[0]) {
        return createUploadUrl(req, files.icon[0]);
    }

    // Handle single file (upload.single)
    if (req.file && req.file.fieldname === "icon") {
        return createUploadUrl(req, req.file);
    }

    if (req.body.icon && typeof req.body.icon === "string") {
        return getFilenameFromUrl(req.body.icon);
    }

    return "";
};

