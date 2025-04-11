import express from "express";
import {
  createComplaint,
  deleteComplaint,
  deleteMediaFromComplaint,
  getAllComplaintsUpvotedByCitizen,
  getComplaintById,
  getComplaintMedia,
  getComplaints,
  getComplaintsByAuthority,
  getComplaintsByCategory,
  getComplaintsByCitizen,
  getComplaintsByStatus,
  getUpvoteCountOfComplaint,
  removeUpvoteFromComplaint,
  updateComplaint,
  updateComplaintAuthority,
  updateComplaintCategory,
  updateComplaintStatus,
  upvoteComplaint,
} from "../controllers/complaintController";
import { upload } from "../middlewares/upload";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { isCitizen } from "../middlewares/isCitizen";
import { isAdmin } from "../middlewares/isAdmin";
import multer from "multer";

const router = express.Router();
const uploadMulter = multer();

// Get All Complaints
// router.route("/").get(isAuthenticated, isAdmin, getComplaints);
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

// Get all complaints upvoted by a specific citizen
router
  .route("/upvoted/citizen/:citizenId")
  .get(getAllComplaintsUpvotedByCitizen);

// Get upvote count for a complaint
router.route("/:complaintId/upvotes/count").get(getUpvoteCountOfComplaint);

// Create new complaint
router.post("/", uploadMulter.array("file"), createComplaint);

// Upvote a complaint
router.post("/:complaintId/upvote", upvoteComplaint);

// Update complaint details
router.put("/:complaintId", updateComplaint);

// Update only status
router.patch("/:complaintId/status", updateComplaintStatus);

// Update only category
router.patch("/:complaintId/category", updateComplaintCategory);

// Reassign authority
router.patch("/:complaintId/authority", updateComplaintAuthority);

// Delete complaint + cascade media & upvotes
router.delete("/:complaintId", deleteComplaint);

// Delete specific media from a complaint
router.delete("/:complaintId/media/:mediaId", deleteMediaFromComplaint);

// Remove an upvote from a complaint by citizen
router.delete("/:complaintId/upvote/:citizenId", removeUpvoteFromComplaint);

export default router;
