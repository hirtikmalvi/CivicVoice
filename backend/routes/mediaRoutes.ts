import express from "express";
import {
  getMediaById,
  getMediaByType,
  updateMedia,
  updateMediaType,
  deleteMedia,
} from "../controllers/mediaController";

const router = express.Router();

// READ
router.get("/:mediaId", getMediaById);
router.get("/type/:mediaType", getMediaByType);

// UPDATE
router.put("/:mediaId", updateMedia);
router.patch("/:mediaId/type", updateMediaType);

// DELETE
router.delete("/:mediaId", deleteMedia);

export default router;
