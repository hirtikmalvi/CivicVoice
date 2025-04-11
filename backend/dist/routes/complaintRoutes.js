"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const complaintController_1 = require("../controllers/complaintController");
const router = express_1.default.Router();
// Get All Complaints
// router.route("/").get(isAuthenticated, isAdmin, getComplaints);
router.route("/").get(complaintController_1.getComplaints);
// Get Complaints By CitizenId
router.route("/citizen/:citizenId").get(complaintController_1.getComplaintsByCitizen);
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
// Create new complaint
router.post("/", complaintController_1.createComplaint);
// Upvote a complaint
router.post("/:complaintId/upvote", complaintController_1.upvoteComplaint);
exports.default = router;
//# sourceMappingURL=complaintRoutes.js.map