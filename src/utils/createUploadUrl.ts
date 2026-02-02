import { Request } from "express";

export const createUploadUrl = (
  req: Request,
  file?: Express.Multer.File
): string => {
  if (!file) return "";

  return file.filename;
};

