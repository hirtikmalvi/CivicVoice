import express from "express";
import multer from "multer";
import { genericUpload } from "../controllers/uploadController";

const upload = multer();
const router = express.Router();

// To upload file/files for complaint
router.post(
  "/complaint/:complaintId",
  upload.single("file"),
  (req, res, next) =>
    genericUpload({
      folder: "complaints",
      model: "complaint_media",
      foreignKey: {
        field: "complaint_id",
        value: req.params.complaintId,
      },
    })(req, res, next)
);
