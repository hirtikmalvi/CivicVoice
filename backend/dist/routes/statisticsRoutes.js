"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statisticsController_1 = require("../controllers/statisticsController");
const router = express_1.default.Router();
router.get("/complaints/per-category", statisticsController_1.getComplaintCountPerCategory);
router.get("/complaints/per-status", statisticsController_1.getComplaintCountPerStatus);
router.get("/complaints/most-upvoted", statisticsController_1.getMostUpvotedComplaints);
router.get("/complaints/recent", statisticsController_1.getRecentComplaints);
router.get("/complaints/resolution-time", statisticsController_1.getAverageResolutionTime);
router.get("/search", statisticsController_1.searchComplaints);
exports.default = router;
//# sourceMappingURL=statisticsRoutes.js.map