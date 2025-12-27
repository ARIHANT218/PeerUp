import express from "express";
import {
  createRoom,
  getRooms,
  getRoom,
  getMessages,
  postMessage
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/rooms", protect, createRoom);
router.get("/rooms", protect, getRooms);
router.get("/rooms/:id", protect, getRoom);
router.get("/rooms/:id/messages", protect, getMessages);
router.post("/rooms/:id/messages", protect, postMessage);

export default router;

