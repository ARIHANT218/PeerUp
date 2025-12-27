import express from "express";
import { getInsight } from "../controllers/insightController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getInsight);

export default router;

