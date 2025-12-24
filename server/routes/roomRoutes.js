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

/**
 * =========================
 * PUBLIC ROUTES
 * =========================
 */

// Get available rooms (for users)
roomRouter.get("/", getRooms);

/**
 * =========================
 * OWNER ROUTES (Protected)
 * =========================
 */

// Create room
roomRouter.post(
  "/",
  protect,
  upload.array("images", 5),
  createRoom
);

// Get rooms of owner
roomRouter.get("/owner", protect, getOwnerRooms);

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

// Toggle availability
roomRouter.patch(
  "/:roomId/toggle-availability",
  protect,
  toggleRoomAvailability
);

export default roomRouter;