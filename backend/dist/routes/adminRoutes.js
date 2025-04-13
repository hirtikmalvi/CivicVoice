"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminController_1 = require("../controllers/adminController");
const authController_1 = require("../controllers/authController");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
// Register a new user (Admin)
router.post("/register", adminController_1.registerAdmin);
// Log in a user and return JWT token in a cookie
router.post("/login", authController_1.handleLogin);
//logout
router.post("/logout", authController_1.handleLogout);
//delete
router.delete("/delete", authMiddleware_1.isAuthenticated, isAdmin_1.isAdmin, adminController_1.deleteAdmin);
//get admin profile
router.get("/me", authMiddleware_1.isAuthenticated, isAdmin_1.isAdmin, adminController_1.getAdminProfile);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map