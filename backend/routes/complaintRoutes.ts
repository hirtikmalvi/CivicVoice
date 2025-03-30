import express from "express";
import { getComplaintById, getComplaintMedia, getComplaints, getComplaintsByAuthority, getComplaintsByCategory, getComplaintsByCitizen, getComplaintsByStatus } from "../controllers/complaintController";

const router = express.Router();

// Get All Complaints
router.route("/").get(getComplaints);

// Get Complaints By CitizenId
router.route("/citizen/:citizenId").get(getComplaintsByCitizen);

// Get Complaint By Complaint ID
router.route("/:complaintId").get(getComplaintById)

// Get Complaints By Category Name
router.route("/category/:categoryName").get(getComplaintsByCategory);

// Get Complaints By Status
router.route("/status/:statusName").get(getComplaintsByStatus);

// Get All Media of a Complaint
router.route("/:complaintId/media").get(getComplaintMedia);

// Get All Complaints assigned to specific authority
router.route("/authority/:authorityId").get(getComplaintsByAuthority);


export default router;