import { Request } from "express";

export const getBaseUrl = (req: Request): string => {
  const protocol = req.protocol;
  const host = req.get("host");
  const basePath = process.env.BASE_PATH || "";

  return `${protocol}://${host}${basePath}`;
};
