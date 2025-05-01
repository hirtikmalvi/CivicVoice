"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authorityController_1 = require("../controllers/authorityController");
const authController_1 = require("../controllers/authController");
const isAuthority_1 = require("../middlewares/isAuthority");
const router = express_1.default.Router();
// Register a new user (Authority)
router.post("/register", authorityController_1.registerAuthority);
// Log in a user and return JWT token in a cookie
router.post("/login", authController_1.handleLogin);
//logout
router.post("/logout", authController_1.handleLogout);
// delete
router.delete("/delete", authMiddleware_1.isAuthenticated, isAuthority_1.isAuthority, authorityController_1.deleteAuthority);
// get authority profile
router.get("/me", authMiddleware_1.isAuthenticated, isAuthority_1.isAuthority, authorityController_1.getAuthorityProfile);
//update authority
router.put("/update", authMiddleware_1.isAuthenticated, isAuthority_1.isAuthority, authorityController_1.updateAuthorityProfile);
router.get("/:authority_id", authorityController_1.getAuthorityById);
//get authority by user_id
router.get("/user/:user_id", authorityController_1.getAuthorityByUserId);
exports.default = router;
//# sourceMappingURL=authorityRoutes.js.map