import express from "express";
import { findMatches } from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/search", protect, findMatches);

export default router;
