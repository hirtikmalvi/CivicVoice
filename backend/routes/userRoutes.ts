import express from "express";
import { handleLogin, handleRegistration } from "../controllers/userController";
const router = express.Router();

router.post("/register", handleRegistration)
router.post("/login", handleLogin)

export default router;