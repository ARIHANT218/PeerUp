import express from "express";
import {
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  leaveGroup,
  deleteGroup
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGroup);
router.get("/", protect, getGroups);
router.get("/:id", protect, getGroup);
router.post("/:id/join", protect, joinGroup);
router.post("/:id/leave", protect, leaveGroup);
router.delete("/:id", protect, deleteGroup);

export default router;

