import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// API to create a new hotel
// POST /api/hotels
export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    await Hotel.create({ name, address, contact, city, owner });

    // Update User Role if needed
    if (req.user.role !== "hotelOwner") {
      await User.findByIdAndUpdate(owner, { role: "hotelOwner" });
    }

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to fetch all hotels (optional city filter) - Chỉ hiện khách sạn đã duyệt
// GET /api/hotels
export const getHotels = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { isApproved: true, isActive: true };
    if (city) {
      filter.city = new RegExp(city, "i");
    }
    const hotels = await Hotel.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, hotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to fetch hotels owned by the authenticated user
// GET /api/hotels/owner
export const getOwnerHotels = async (req, res) => {
  try {
    const owner = req.auth.userId;
    const hotels = await Hotel.find({ owner }).sort({ createdAt: -1 });
    res.json({ success: true, hotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to update hotel details
// PUT /api/hotels/:id
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contact, city } = req.body;
    const owner = req.auth.userId;

    // Check if hotel exists and belongs to the owner
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    if (hotel.owner.toString() !== owner) {
      return res.json({
        success: false,
        message: "Unauthorized to update this hotel",
      });
    }

    // Update hotel
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { name, address, contact, city },
      { new: true }
    );

    res.json({
      success: true,
      message: "Hotel Updated Successfully",
      hotel: updatedHotel,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to delete hotel
// DELETE /api/hotels/:id
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.auth.userId;

    // Check if hotel exists and belongs to the owner
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    if (hotel.owner.toString() !== owner) {
      return res.json({
        success: false,
        message: "Unauthorized to delete this hotel",
      });
    }

    // Delete hotel
    await Hotel.findByIdAndDelete(id);

    res.json({ success: true, message: "Hotel Deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
