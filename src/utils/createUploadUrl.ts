import { Request } from "express";
import { getBaseUrl } from "./getBaseUrl";

export const createUploadUrl = (
  req: Request,
  file?: Express.Multer.File
): string => {
  if (!file) return "";

  const baseUrl = getBaseUrl(req);
  const normalizedPath = file.path.replace(/\\/g, "/");

  return `${baseUrl}/${normalizedPath}`;
};
