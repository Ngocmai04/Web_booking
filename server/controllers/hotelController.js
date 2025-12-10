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

// API to fetch all hotels (optional city filter)
// GET /api/hotels
export const getHotels = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { city: new RegExp(city, "i") } : {};
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
