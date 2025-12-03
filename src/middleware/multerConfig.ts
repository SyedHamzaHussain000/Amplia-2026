import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

// Create folder if not exists
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    // choose folder based on field
    if (file.fieldname === "profile") uploadPath = "uploads/profile/";
    if (file.fieldname === "cover") uploadPath = "uploads/cover/";
    if (file.fieldname === "file") uploadPath = "uploads/file/";

    ensureDir(uploadPath); // make sure folder exists

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.fieldname === "file") {
    // only PDF
    if (file.mimetype === "application/pdf") return cb(null, true);
    return cb(new Error("Only PDF files are allowed for 'file' upload!"));
  }

  // profile or cover: only image
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  return cb(new Error("Invalid file type!"));
};

const upload = multer({ storage, fileFilter });

export default upload;
