import express from "express";
import {
  getMessagesByRoom,
  createMessage,
  createRoom,
  getUserRoom,
  agentRoom,
} from "../controllers/message.controller.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.use(protect);

router.get("/agents-room", agentRoom);

router.get("/user/rooms", getUserRoom);

router.get("/room/:roomId", getMessagesByRoom);

router.post("/create-room", createRoom);

router.post("/room/:roomId/message", createMessage);

export default router;
