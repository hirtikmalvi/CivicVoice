"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const complaintController_1 = require("../controllers/complaintController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const uploadMulter = (0, multer_1.default)();
// Get All Complaints
// router.route("/").get(isAuthenticated, isAdmin, getComplaints);
router.route("/").get(complaintController_1.getComplaints);
// Get Complaints By CitizenId
router.route("/citizen/:citizenId").get(complaintController_1.getComplaintsByCitizen);
// Trending
router.route("/trending").get(complaintController_1.getTrendingComplaints);
// Get Complaint By Complaint ID
router.route("/:complaintId").get(complaintController_1.getComplaintById);
// Get Complaints By Category Name
router.route("/category/:categoryName").get(complaintController_1.getComplaintsByCategory);
// Get Complaints By Status
router.route("/status/:statusName").get(complaintController_1.getComplaintsByStatus);
// Get All Media of a Complaint
router.route("/:complaintId/media").get(complaintController_1.getComplaintMedia);
// Get All Complaints assigned to specific authority
router.route("/authority/:authorityId").get(complaintController_1.getComplaintsByAuthority);
// Get all complaints upvoted by a specific citizen
router
    .route("/upvoted/citizen/:citizenId")
    .get(complaintController_1.getAllComplaintsUpvotedByCitizen);
// Get upvote count for a complaint
router.route("/:complaintId/upvotes/count").get(complaintController_1.getUpvoteCountOfComplaint);
// Create new complaint
router.post("/", uploadMulter.array("file"), complaintController_1.createComplaint);
// Upvote a complaint
router.post("/:complaintId/upvote", complaintController_1.upvoteComplaint);
// Update complaint details
router.put("/:complaintId", complaintController_1.updateComplaint);
// Update only status
router.patch("/:complaintId/status", complaintController_1.updateComplaintStatus);
// Update only category
router.patch("/:complaintId/category", complaintController_1.updateComplaintCategory);
// Reassign authority
router.patch("/:complaintId/authority", complaintController_1.updateComplaintAuthority);
// Delete complaint + cascade media & upvotes
router.delete("/:complaintId", complaintController_1.deleteComplaint);
// Delete specific media from a complaint
router.delete("/:complaintId/media/:mediaId", complaintController_1.deleteMediaFromComplaint);
// Remove an upvote from a complaint by citizen
router.delete("/:complaintId/upvote/:citizenId", complaintController_1.removeUpvoteFromComplaint);
exports.default = router;
//# sourceMappingURL=complaintRoutes.js.map