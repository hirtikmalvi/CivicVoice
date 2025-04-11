"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upvoteController_1 = require("../controllers/upvoteController");
const router = express_1.default.Router();
// READ
router.get("/complaint/:complaintId", upvoteController_1.getUpvotesByComplaint);
router.get("/citizen/:citizenId", upvoteController_1.getUpvotesByCitizen);
exports.default = router;
//# sourceMappingURL=upvoteRoutes.js.map