import Rating from "../models/Rating.js";
import mongoose from "mongoose";

export const getRating = async (req, res) => {
  try {
    const { hotel } = req.query;

    if (!hotel) {
      return res.status(400).json({
        success: false,
        message: "hotel is required",
      });
    }

    const ratings = await Rating.find({ hotel })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

