import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import {
  deleteAdmin,
  deleteAuthorityByAuthorityId,
  deleteCitizenByCitizenId,
  deleteCitizenByUserId,
  deleteUserByUserId,
  getAdminByUserId,
  getAdminProfile,
  getAllAuthorities,
  getAllCitizens,
  getAllUsers,
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

// get all citizens
router.get("/all/citizens", getAllCitizens);

// get all authorities
router.get("/all/authorities", getAllAuthorities);

// get all users
router.get("/all/users", getAllUsers);

//delete
router.delete("/delete", isAuthenticated, isAdmin, deleteAdmin);

//get admin profile
router.get("/me", isAuthenticated, isAdmin, getAdminProfile);

//delete citizen
router.delete("/by-citizen-id/:citizen_id", deleteCitizenByCitizenId);
router.delete("/by-user-id/:user_id", deleteCitizenByUserId);

//delete user (deletes user and respective user_type)
router.delete("/user/:user_id", deleteUserByUserId);

//delete authority
router.delete("/by-authority-id/:authority_id", deleteAuthorityByAuthorityId)

//get admin by userid
router.get("/user/:user_id", getAdminByUserId)

export default router;
