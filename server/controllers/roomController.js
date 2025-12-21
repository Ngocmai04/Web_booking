import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * =========================
 * CREATE ROOM
 * POST /api/rooms
 * =========================
 */
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities, hotelId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ success: false, message: "Invalid hotelId" });
    }

    // Check hotel ownership
    const hotel = await Hotel.findOne({
      _id: hotelId,
      owner: req.auth.userId,
      isDeleted: { $ne: true },
    });

    if (!hotel) {
      return res.status(403).json({
        success: false,
        message: "Hotel not found or you are not the owner",
      });
    }

    // Upload images to Cloudinary
    const images =
      req.files && req.files.length
        ? await Promise.all(
            req.files.map(async (file) => {
              const result = await cloudinary.uploader.upload(file.path, {
                folder: "hotel_rooms",
              });
              return result.secure_url;
            })
          )
        : [];

    const room = await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: amenities ? JSON.parse(amenities) : [],
      images,
      isAvailable: true,
      isDeleted: false,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("createRoom error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * =========================
 * GET ROOMS (PUBLIC)
 * GET /api/rooms
 * GET /api/rooms?hotelId=xxx
 * =========================
 */
export const getRooms = async (req, res) => {
  try {
    const { hotelId } = req.query;

    const filters = {
      isAvailable: true,
      isDeleted: false,
    };

    if (hotelId) {
      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({ success: false, message: "Invalid hotelId" });
      }
      filters.hotel = hotelId;
    }

    const rooms = await Room.find(filters)
      .populate({
        path: "hotel",
        match: { isDeleted: { $ne: true } },
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });

    // Remove rooms whose hotel was soft-deleted
    const validRooms = rooms.filter((room) => room.hotel);

    res.json({ success: true, rooms: validRooms });
  } catch (error) {
    console.error("getRooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * =========================
 * GET ROOMS BY OWNER
 * GET /api/rooms/owner
 * GET /api/rooms/owner?hotelId=xxx
 * =========================
 */
export const getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.auth.userId;
    const { hotelId } = req.query;

    const ownerHotels = await Hotel.find({
      owner: ownerId,
      isDeleted: { $ne: true },
    });

    if (!ownerHotels.length) {
      return res.json({ success: false, message: "No hotels found for this owner" });
    }

    let selectedHotel;

    if (hotelId) {
      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({ success: false, message: "Invalid hotelId" });
      }

      selectedHotel = ownerHotels.find(
        (hotel) => hotel._id.toString() === hotelId
      );
    } else {
      selectedHotel = ownerHotels[0];
    }

    if (!selectedHotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    const rooms = await Room.find({
      hotel: selectedHotel._id,
      isDeleted: false,
    }).populate("hotel");

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("getOwnerRooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * =========================
 * UPDATE ROOM
 * PUT /api/rooms/:roomId
 * =========================
 */
export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ success: false, message: "Invalid roomId" });
    }

    const room = await Room.findById(roomId).populate("hotel");

    if (
      !room ||
      room.isDeleted ||
      room.hotel.owner.toString() !== req.auth.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or room not found",
      });
    }

    const allowedFields = ["roomType", "pricePerNight", "amenities", "isAvailable"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        room[field] =
          field === "amenities" && typeof req.body[field] === "string"
            ? JSON.parse(req.body[field])
            : req.body[field];
      }
    });

    // Optional: update images
    if (req.files && req.files.length) {
      const images = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "hotel_rooms",
          });
          return result.secure_url;
        })
      );
      room.images = images;
    }

    await room.save();

    res.json({ success: true, message: "Room updated successfully", room });
  } catch (error) {
    console.error("updateRoom error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * =========================
 * SOFT DELETE ROOM
 * DELETE /api/rooms/:roomId
 * =========================
 */
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ success: false, message: "Invalid roomId" });
    }

    const room = await Room.findById(roomId).populate("hotel");

    if (
      !room ||
      room.hotel.owner.toString() !== req.auth.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or room not found",
      });
    }

    room.isDeleted = true;
    room.isAvailable = false;
    await room.save();

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.error("deleteRoom error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * =========================
 * TOGGLE AVAILABILITY
 * PATCH /api/rooms/:roomId/toggle-availability
 * =========================
 */
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ success: false, message: "Invalid roomId" });
    }

    const room = await Room.findById(roomId).populate("hotel");

    if (
      !room ||
      room.isDeleted ||
      room.hotel.owner.toString() !== req.auth.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or room not found",
      });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({
      success: true,
      message: "Room availability updated",
      isAvailable: room.isAvailable,
    });
  } catch (error) {
    console.error("toggleRoomAvailability error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * =========================
 * GET SINGLE ROOM
 * GET /api/rooms/:roomId
 * =========================
 */
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ success: false, message: "Invalid roomId" });
    }

    const room = await Room.findOne({
      _id: roomId,
      isDeleted: false,
    }).populate("hotel");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check authorization if user is owner
    if (req.auth?.userId && room.hotel.owner.toString() !== req.auth.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    res.json({ success: true, room });
  } catch (error) {
    console.error("getRoomById error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
