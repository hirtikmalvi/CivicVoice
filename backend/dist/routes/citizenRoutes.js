"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const citizenController_1 = require("../controllers/citizenController");
const authController_1 = require("../controllers/authController");
const isCitizen_1 = require("../middlewares/isCitizen");
const router = express_1.default.Router();
// Register a new user (Citizen)
router.post("/register", citizenController_1.registerCitizen);
// Log in a user and return JWT token in a cookie
router.post("/login", authController_1.handleLogin);
//logout
router.post("/logout", authController_1.handleLogout);
//delete
router.delete("/delete", authMiddleware_1.isAuthenticated, isCitizen_1.isCitizen, citizenController_1.deleteCitizen);
//get profile
router.get("/me", authMiddleware_1.isAuthenticated, isCitizen_1.isCitizen, citizenController_1.getCitizenProfile);
// get citizen by id
router.get("/:citizen_id", citizenController_1.getCitizenById);
// router.get("/:citizen_id", isAuthenticated, isCitizen, getCitizenById);
// router.get("/:citizen_id", isAuthenticated, getCitizenById);
//get citizen by user_id
router.get("/user/:user_id", citizenController_1.getCitizenByUserId);
//update profile
router.put("/update", authMiddleware_1.isAuthenticated, isCitizen_1.isCitizen, citizenController_1.updateCitizenProfile);
exports.default = router;
//# sourceMappingURL=citizenRoutes.js.map