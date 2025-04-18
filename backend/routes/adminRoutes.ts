import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import {
  deleteAdmin,
  getAdminProfile,
  getAllCitizens,
  registerAdmin,
} from "../controllers/adminController";
import { handleLogin, handleLogout } from "../controllers/authController";
import { isAdmin } from "../middlewares/isAdmin";
const router = express.Router();

// Register a new user (Admin)
router.post("/register", registerAdmin);

// Log in a user and return JWT token in a cookie
router.post("/login", handleLogin);

//logout
router.post("/logout", handleLogout);

// get all users
router.get("/all/citizens", isAuthenticated, getAllCitizens);

//delete
router.delete("/delete", isAuthenticated, isAdmin, deleteAdmin);

//get admin profile
router.get("/me", isAuthenticated, isAdmin, getAdminProfile);

export default router;
