import express from "express";
import {
  createComplaint,
  getComplaintById,
  getComplaintMedia,
  getComplaints,
  getComplaintsByAuthority,
  getComplaintsByCategory,
  getComplaintsByCitizen,
  getComplaintsByStatus,
  upvoteComplaint,
} from "../controllers/complaintController";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Get All Complaints
router.route("/").get(getComplaints);

// Get Complaints By CitizenId
router.route("/citizen/:citizenId").get(getComplaintsByCitizen);

// Get Complaint By Complaint ID
router.route("/:complaintId").get(getComplaintById);

// Get Complaints By Category Name
router.route("/category/:categoryName").get(getComplaintsByCategory);

// Get Complaints By Status
router.route("/status/:statusName").get(getComplaintsByStatus);

// Get All Media of a Complaint
router.route("/:complaintId/media").get(getComplaintMedia);

// Get All Complaints assigned to specific authority
router.route("/authority/:authorityId").get(getComplaintsByAuthority);

// Create new complaint
router.post("/", createComplaint);

// Upvote a complaint
router.post("/:complaintId/upvote", upvoteComplaint);

export default router;
