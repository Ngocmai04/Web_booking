import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
  // User management
  addUserAdmin,
  getAllUsers,
  getUserById,
  changeUserRole,
  // Hotel management
  addHotelAdmin,
  updateHotelAdmin,
  getAllHotelsAdmin,
  getPendingHotels,
  approveHotel,
  rejectHotel,
  toggleHotelActive,
  deleteHotelAdmin,
  // Room management
  addRoomAdmin,
  getAllRoomsAdmin,
  deleteRoomAdmin,
  // Booking management
  getAllBookingsAdmin,
  updateBookingStatus,
  // Statistics
  getStats,
  getHotelStats,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Tất cả routes đều yêu cầu đăng nhập và là Admin
adminRouter.use(protect, isAdmin);

// ==================== USER ROUTES ====================
adminRouter.post("/users", addUserAdmin);
adminRouter.get("/users", getAllUsers);
adminRouter.get("/users/:id", getUserById);
adminRouter.put("/users/:id/role", changeUserRole);

// ==================== HOTEL ROUTES ====================
adminRouter.post("/hotels", addHotelAdmin);
adminRouter.put("/hotels/:id", updateHotelAdmin);
adminRouter.get("/hotels", getAllHotelsAdmin);
adminRouter.get("/hotels/pending", getPendingHotels);
adminRouter.put("/hotels/:id/approve", approveHotel);
adminRouter.put("/hotels/:id/reject", rejectHotel);
adminRouter.put("/hotels/:id/toggle-active", toggleHotelActive);
adminRouter.delete("/hotels/:id", deleteHotelAdmin);

// ==================== ROOM ROUTES ====================
adminRouter.post("/rooms", addRoomAdmin);
adminRouter.get("/rooms", getAllRoomsAdmin);
adminRouter.delete("/rooms/:id", deleteRoomAdmin);

// ==================== BOOKING ROUTES ====================
adminRouter.get("/bookings", getAllBookingsAdmin);
adminRouter.put("/bookings/:id/status", updateBookingStatus);

// ==================== STATISTICS ROUTES ====================
adminRouter.get("/stats", getStats);
adminRouter.get("/stats/hotels", getHotelStats);

export default adminRouter;
