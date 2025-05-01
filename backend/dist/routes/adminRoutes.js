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
// get all citizens
router.get("/all/citizens", adminController_1.getAllCitizens);
// get all authorities
router.get("/all/authorities", adminController_1.getAllAuthorities);
// get all users
router.get("/all/users", adminController_1.getAllUsers);
//delete
router.delete("/delete", authMiddleware_1.isAuthenticated, isAdmin_1.isAdmin, adminController_1.deleteAdmin);
//get admin profile
router.get("/me", authMiddleware_1.isAuthenticated, isAdmin_1.isAdmin, adminController_1.getAdminProfile);
//delete citizen
router.delete("/by-citizen-id/:citizen_id", adminController_1.deleteCitizenByCitizenId);
router.delete("/by-user-id/:user_id", adminController_1.deleteCitizenByUserId);
//delete user (deletes user and respective user_type)
router.delete("/user/:user_id", adminController_1.deleteUserByUserId);
//delete authority
router.delete("/by-authority-id/:authority_id", adminController_1.deleteAuthorityByAuthorityId);
//get admin by userid
router.get("/user/:user_id", adminController_1.getAdminByUserId);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map