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

    switch (file.fieldname) {
      case "profile":
        uploadPath = "uploads/profile/";
        break;
      case "cover":
        uploadPath = "uploads/cover/";
        break;
      case "media":
        uploadPath = "uploads/message/media/";
        break;
      case "messageFile":
        uploadPath = "uploads/message/files/";
        break;
      case "file":
        uploadPath = "uploads/file/";
        break;
      default:
        uploadPath = "uploads/others/";
    }

    ensureDir(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
  switch (file.fieldname) {
    case "file":        // old PDFs
    case "messageFile": // new PDFs
      if (file.mimetype === "application/pdf") return cb(null, true);
      return cb(new Error("Only PDF files are allowed!"));

    case "media":       // images or videos
      if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) return cb(null, true);
      return cb(new Error("Only image or video files are allowed for 'media' upload!"));

    case "profile":     // profile image
    case "cover":       // cover image
      if (file.mimetype.startsWith("image/")) return cb(null, true);
      return cb(new Error("Only images are allowed for profile/cover!"));

    default:
      return cb(new Error("Invalid file type!"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
