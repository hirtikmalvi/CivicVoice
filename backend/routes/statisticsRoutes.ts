import express from "express";
import {
  getComplaintCountPerCategory,
  getComplaintCountPerStatus,
  getMostUpvotedComplaints,
  getRecentComplaints,
  getAverageResolutionTime,
  searchComplaints,
} from "../controllers/statisticsController";

const router = express.Router();

router.get("/complaints/per-category", getComplaintCountPerCategory);
router.get("/complaints/per-status", getComplaintCountPerStatus);
router.get("/complaints/most-upvoted", getMostUpvotedComplaints);
router.get("/complaints/recent", getRecentComplaints);
router.get("/complaints/resolution-time", getAverageResolutionTime);
router.get("/search", searchComplaints);

export default router;
