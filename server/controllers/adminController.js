import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================

// Thêm người dùng mới (Admin)
// POST /api/admin/users
export const addUserAdmin = async (req, res) => {
  try {
    const { username, email, role } = req.body;

    // Validate
    if (!username || !email || !role) {
      return res.json({
        success: false,
        message: "Username, email, and role are required.",
      });
    }

    if (!["user", "hotelOwner", "admin"].includes(role)) {
      return res.json({ success: false, message: "Invalid role." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already in use." });
    }

    // Create user (note: password is usually set by Clerk, but we'll create without it for admin)
    const user = await User.create({
      username,
      email,
      role,
      isActive: true,
    });

    res.json({ success: true, message: "User added successfully.", user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

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
      return res.json({ success: false, message: "User not found." });
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
      return res.json({ success: false, message: "User not found." });
    }

    // Không cho phép khóa chính mình
    if (user._id === req.user._id) {
      return res.json({
        success: false,
        message: "You cannot lock your own account.",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: user.isActive ? "Account unlocked." : "Account locked.",
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
      return res.json({ success: false, message: "Invalid role." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    // Không cho phép thay đổi role của chính mình
    if (user._id === req.user._id) {
      return res.json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, message: "Role updated.", user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==================== QUẢN LÝ KHÁCH SẠN ====================

// Thêm khách sạn (Admin)
// POST /api/admin/hotels
export const addHotelAdmin = async (req, res) => {
  try {
    const { name, address, contact, city, latitude, longitude, ownerId } =
      req.body;

    // Kiểm tra thông tin bắt buộc
    if (!name || !address || !contact || !city || !ownerId) {
      return res.json({
        success: false,
        message: "Name, address, contact, city, and owner are required.",
      });
    }

    // Kiểm tra owner có tồn tại
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.json({ success: false, message: "Owner not found." });
    }

    const lat =
      latitude === null || latitude === undefined ? null : Number(latitude);
    const lng =
      longitude === null || longitude === undefined ? null : Number(longitude);

    const hotel = await Hotel.create({
      name,
      address,
      contact,
      city,
      owner: ownerId,
      latitude: Number.isFinite(lat) ? lat : null,
      longitude: Number.isFinite(lng) ? lng : null,
      isApproved: true, // Admin tự động approve
    });

    // Cập nhật role người dùng thành hotelOwner nếu chưa
    if (owner.role !== "hotelOwner") {
      await User.findByIdAndUpdate(ownerId, { role: "hotelOwner" });
    }

    res.json({ success: true, message: "Hotel added successfully.", hotel });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Cập nhật khách sạn (Admin)
// PUT /api/admin/hotels/:id
export const updateHotelAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contact, city, latitude, longitude, ownerId } =
      req.body;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found." });
    }

    // Nếu thay đổi owner, kiểm tra owner mới có tồn tại
    if (ownerId && ownerId !== hotel.owner.toString()) {
      const newOwner = await User.findById(ownerId);
      if (!newOwner) {
        return res.json({ success: false, message: "New owner not found." });
      }
      hotel.owner = ownerId;

      // Cập nhật role người dùng thành hotelOwner nếu chưa
      if (newOwner.role !== "hotelOwner") {
        await User.findByIdAndUpdate(ownerId, { role: "hotelOwner" });
      }
    }

    const lat =
      latitude === null || latitude === undefined ? null : Number(latitude);
    const lng =
      longitude === null || longitude === undefined ? null : Number(longitude);

    if (name) hotel.name = name;
    if (address) hotel.address = address;
    if (contact) hotel.contact = contact;
    if (city) hotel.city = city;
    if (Number.isFinite(lat)) hotel.latitude = lat;
    if (Number.isFinite(lng)) hotel.longitude = lng;

    await hotel.save();

    res.json({ success: true, message: "Hotel updated.", hotel });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

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
      return res.json({ success: false, message: "Hotel not found." });
    }

    hotel.isApproved = true;
    await hotel.save();

    res.json({ success: true, message: "Hotel approved.", hotel });
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
      return res.json({ success: false, message: "Hotel not found." });
    }

    // Xóa khách sạn bị từ chối
    await Hotel.findByIdAndDelete(id);

    res.json({ success: true, message: "Hotel rejected and deleted." });
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
      return res.json({ success: false, message: "Hotel not found." });
    }

    hotel.isActive = !hotel.isActive;
    await hotel.save();

    res.json({
      success: true,
      message: hotel.isActive ? "Hotel restored." : "Hotel disabled.",
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

    res.json({ success: true, message: "Hotel and all rooms deleted." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==================== QUẢN LÝ PHÒNG ====================

// Thêm phòng mới (Admin)
// POST /api/admin/rooms
export const addRoomAdmin = async (req, res) => {
  try {
    const { hotelId, roomType, pricePerNight, amenities, images } = req.body;

    // Validate
    if (!hotelId || !roomType || !pricePerNight || !amenities) {
      return res.json({
        success: false,
        message: "Hotel, room type, price, and amenities are required.",
      });
    }

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found." });
    }

    const room = await Room.create({
      hotel: hotelId,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: Array.isArray(amenities)
        ? amenities
        : amenities.split(",").map((a) => a.trim()),
      images: images || [],
      isAvailable: true,
    });

    const populatedRoom = await room.populate(
      "hotel",
      "name city owner isApproved isActive"
    );

    res.json({
      success: true,
      message: "Room added successfully.",
      room: populatedRoom,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

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
    res.json({ success: true, message: "Room deleted." });
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
      return res.json({ success: false, message: "Invalid status." });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.json({ success: false, message: "Booking not found." });
    }

    res.json({ success: true, message: "Booking status updated.", booking });
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
