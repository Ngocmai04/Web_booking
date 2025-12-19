import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
// POST /api/rooms
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities, hotelId } = req.body;

    const hotel = await Hotel.findOne({ _id: hotelId, owner: req.auth.userId });

    if (!hotel) return res.json({ success: false, message: "Hotel not found for this owner" });

    // upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms
// GET /api/rooms
export const getRooms = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const filters = { isAvailable: true };

    if (hotelId) {
      filters.hotel = hotelId;
    }

    // Lấy thô, lọc room có hotel id hợp lệ để tránh CastError
    const rawRooms = await Room.find(filters).sort({ createdAt: -1 }).lean();
    const validRooms = rawRooms.filter((room) => mongoose.Types.ObjectId.isValid(room.hotel));

    const rooms = await Room.populate(validRooms, {
      path: "hotel",
      populate: {
        path: "owner",
        select: "image",
      },
      options: { strictPopulate: false },
    });

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("getRooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all rooms for a specific hotel
// GET /api/rooms/owner
export const getOwnerRooms = async (req, res) => {
  try {
    const ownerHotels = await Hotel.find({ owner: req.auth.userId });

    if (!ownerHotels.length) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const { hotelId } = req.query;
    const selectedHotel = hotelId
      ? ownerHotels.find((hotel) => hotel._id.toString() === hotelId)
      : ownerHotels[0];

    if (!selectedHotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const rooms = await Room.find({ hotel: selectedHotel._id.toString() }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    console.log(error);

    res.json({ success: false, message: error.message });
  }
};

// API to toggle availability of a room
// POST /api/rooms/toggle-availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Room availability Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
