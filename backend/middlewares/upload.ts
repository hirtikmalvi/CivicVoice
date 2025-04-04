import cloudinary from "../config/cloudinary";
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("audio/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images, audio, and video files are allowed!"), false);
  }
};

export const upload = multer({ storage, fileFilter });
