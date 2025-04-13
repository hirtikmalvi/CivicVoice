import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { deleteAuthority, getAuthorityProfile, registerAuthority, updateAuthorityProfile } from "../controllers/authorityController";
import { handleLogin, handleLogout } from "../controllers/authController";
import { isAuthority } from "../middlewares/isAuthority";

const router = express.Router();


// Register a new user (Authority)
router.post("/register", registerAuthority); 

// Log in a user and return JWT token in a cookie
router.post("/login", handleLogin);

//logout
router.post("/logout", handleLogout);

// delete
router.delete("/delete", isAuthenticated, isAuthority, deleteAuthority)

// get authority profile
router.get("/me", isAuthenticated, isAuthority, getAuthorityProfile)

//update authority
router.put("/update", isAuthenticated, isAuthority, updateAuthorityProfile);

export default router;