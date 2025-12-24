import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createRoom,
  getRooms,
  getOwnerRooms,
  updateRoom,
  deleteRoom,
  toggleRoomAvailability,
  getRoomById,
} from "../controllers/roomController.js";

const roomRouter = express.Router();

// Get available rooms
roomRouter.get("/", getRooms);

// Get rooms of owner
roomRouter.get("/owner", protect, getOwnerRooms);

// ✅ TOGGLE AVAILABILITY – ĐẶT TRƯỚC
roomRouter.patch(
  "/:roomId/toggle-availability",
  protect,
  toggleRoomAvailability
);

// Get single room by ID
roomRouter.get("/:roomId", protect, getRoomById);

// Update room
roomRouter.put(
  "/:roomId",
  protect,
  upload.array("images", 5),
  updateRoom
);

// Soft delete room
roomRouter.delete(
  "/:roomId",
  protect,
  deleteRoom
);

export default roomRouter;
