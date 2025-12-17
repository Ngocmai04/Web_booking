import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================

// Lấy tất cả người dùng
// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Lấy chi tiết người dùng
// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Khóa / Mở khóa tài khoản
// PUT /api/admin/users/:id/toggle-active
export const toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Không cho phép khóa chính mình
    if (user._id === req.user._id) {
      return res.json({
        success: false,
        message: "Không thể khóa tài khoản của chính bạn",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: user.isActive ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản",
      user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Thay đổi role người dùng
// PUT /api/admin/users/:id/role
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "hotelOwner", "admin"].includes(role)) {
      return res.json({ success: false, message: "Role không hợp lệ" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Không cho phép thay đổi role của chính mình
    if (user._id === req.user._id) {
      return res.json({
        success: false,
        message: "Không thể thay đổi role của chính bạn",
      });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, message: "Đã thay đổi role", user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==================== QUẢN LÝ KHÁCH SẠN ====================

// Lấy tất cả khách sạn (bao gồm cả chưa duyệt)
// GET /api/admin/hotels
export const getAllHotelsAdmin = async (req, res) => {
  try {
    const { isApproved, isActive } = req.query;
    const filter = {};

    if (isApproved !== undefined) {
      filter.isApproved = isApproved === "true";
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const hotels = await Hotel.find(filter)
      .populate("owner", "username email")
      .sort({ createdAt: -1 });
    res.json({ success: true, hotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Lấy khách sạn chờ duyệt
// GET /api/admin/hotels/pending
export const getPendingHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isApproved: false, isActive: true })
      .populate("owner", "username email")
      .sort({ createdAt: -1 });
    res.json({ success: true, hotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Duyệt khách sạn
// PUT /api/admin/hotels/:id/approve
export const approveHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.json({ success: false, message: "Không tìm thấy khách sạn" });
    }

    hotel.isApproved = true;
    await hotel.save();

    res.json({ success: true, message: "Đã duyệt khách sạn", hotel });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Từ chối duyệt khách sạn
// PUT /api/admin/hotels/:id/reject
export const rejectHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.json({ success: false, message: "Không tìm thấy khách sạn" });
    }

    // Xóa khách sạn bị từ chối
    await Hotel.findByIdAndDelete(id);

    res.json({ success: true, message: "Đã từ chối và xóa khách sạn" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Gỡ / Khôi phục khách sạn vi phạm
// PUT /api/admin/hotels/:id/toggle-active
export const toggleHotelActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.json({ success: false, message: "Không tìm thấy khách sạn" });
    }

    hotel.isActive = !hotel.isActive;
    await hotel.save();

    res.json({
      success: true,
      message: hotel.isActive ? "Đã khôi phục khách sạn" : "Đã gỡ khách sạn",
      hotel,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Xóa khách sạn (Admin force delete)
// DELETE /api/admin/hotels/:id
export const deleteHotelAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Xóa tất cả phòng của khách sạn
    await Room.deleteMany({ hotel: id });

    // Xóa khách sạn
    await Hotel.findByIdAndDelete(id);

    res.json({ success: true, message: "Đã xóa khách sạn và tất cả phòng" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==================== QUẢN LÝ PHÒNG ====================

// Lấy tất cả phòng
// GET /api/admin/rooms
export const getAllRoomsAdmin = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("hotel", "name city owner isApproved isActive")
      .sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Xóa phòng (Admin force delete)
// DELETE /api/admin/rooms/:id
export const deleteRoomAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.json({ success: true, message: "Đã xóa phòng" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==================== QUẢN LÝ BOOKING ====================

// Lấy tất cả booking
// GET /api/admin/bookings
export const getAllBookingsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const bookings = await Booking.find(filter)
      .populate("user", "username email")
      .populate("room", "roomType pricePerNight")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái booking
// PUT /api/admin/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.json({ success: false, message: "Không tìm thấy booking" });
    }

    res.json({ success: true, message: "Đã cập nhật trạng thái", booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==================== THỐNG KÊ ====================

// Thống kê tổng quan
// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHotelOwners = await User.countDocuments({ role: "hotelOwner" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalHotels = await Hotel.countDocuments();
    const pendingHotels = await Hotel.countDocuments({
      isApproved: false,
      isActive: true,
    });
    const approvedHotels = await Hotel.countDocuments({ isApproved: true });
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });

    // Tổng doanh thu
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "pending"] }, isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Doanh thu theo tháng (12 tháng gần nhất)
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "pending"] } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          hotelOwners: totalHotelOwners,
          admins: totalAdmins,
          regularUsers: totalUsers - totalHotelOwners - totalAdmins,
        },
        hotels: {
          total: totalHotels,
          pending: pendingHotels,
          approved: approvedHotels,
        },
        rooms: { total: totalRooms },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          pending: totalBookings - confirmedBookings - cancelledBookings,
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
        },
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Thống kê doanh thu theo khách sạn
// GET /api/admin/stats/hotels
export const getHotelStats = async (req, res) => {
  try {
    const hotelStats = await Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "pending"] } } },
      {
        $group: {
          _id: "$hotel",
          totalRevenue: { $sum: "$totalPrice" },
          totalBookings: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "_id",
          foreignField: "_id",
          as: "hotelInfo",
        },
      },
      { $unwind: "$hotelInfo" },
      {
        $project: {
          hotelName: "$hotelInfo.name",
          city: "$hotelInfo.city",
          totalRevenue: 1,
          totalBookings: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({ success: true, hotelStats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
