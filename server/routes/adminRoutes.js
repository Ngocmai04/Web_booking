import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
  // User management
  getAllUsers,
  getUserById,
  toggleUserActive,
  changeUserRole,
  // Hotel management
  getAllHotelsAdmin,
  getPendingHotels,
  approveHotel,
  rejectHotel,
  toggleHotelActive,
  deleteHotelAdmin,
  // Room management
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
adminRouter.get("/users", getAllUsers);
adminRouter.get("/users/:id", getUserById);
adminRouter.put("/users/:id/toggle-active", toggleUserActive);
adminRouter.put("/users/:id/role", changeUserRole);

// ==================== HOTEL ROUTES ====================
adminRouter.get("/hotels", getAllHotelsAdmin);
adminRouter.get("/hotels/pending", getPendingHotels);
adminRouter.put("/hotels/:id/approve", approveHotel);
adminRouter.put("/hotels/:id/reject", rejectHotel);
adminRouter.put("/hotels/:id/toggle-active", toggleHotelActive);
adminRouter.delete("/hotels/:id", deleteHotelAdmin);

// ==================== ROOM ROUTES ====================
adminRouter.get("/rooms", getAllRoomsAdmin);
adminRouter.delete("/rooms/:id", deleteRoomAdmin);

// ==================== BOOKING ROUTES ====================
adminRouter.get("/bookings", getAllBookingsAdmin);
adminRouter.put("/bookings/:id/status", updateBookingStatus);

// ==================== STATISTICS ROUTES ====================
adminRouter.get("/stats", getStats);
adminRouter.get("/stats/hotels", getHotelStats);

export default adminRouter;
