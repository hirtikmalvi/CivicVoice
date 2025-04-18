import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import {
  deleteCitizen,
  getCitizenById,
  getCitizenByUserId,
  getCitizenProfile,
  registerCitizen,
  updateCitizenProfile,
} from "../controllers/citizenController";
import { handleLogin, handleLogout } from "../controllers/authController";
import { isCitizen } from "../middlewares/isCitizen";

const router = express.Router();

// Register a new user (Citizen)
router.post("/register", registerCitizen);

// Log in a user and return JWT token in a cookie
router.post("/login", handleLogin);

//logout
router.post("/logout", handleLogout);

//delete
router.delete("/delete", isAuthenticated, isCitizen, deleteCitizen);

//get profile
router.get("/me", isAuthenticated, isCitizen, getCitizenProfile);

// get citizen by id
router.get("/:citizen_id", getCitizenById);

//get citizen by user_id
router.get("/user/:user_id", getCitizenByUserId);

//update profile
router.put("/update", isAuthenticated, isCitizen, updateCitizenProfile);

export default router;
