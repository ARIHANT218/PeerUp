import express from "express";
import { updateProfile, getProfile, getCurrentUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
