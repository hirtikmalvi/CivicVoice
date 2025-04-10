import express from "express";
import {
  getUpvotesByComplaint,
  getUpvotesByCitizen,
} from "../controllers/upvoteController";

const router = express.Router();

// READ
router.get("/complaint/:complaintId", getUpvotesByComplaint);
router.get("/citizen/:citizenId", getUpvotesByCitizen);

export default router;
