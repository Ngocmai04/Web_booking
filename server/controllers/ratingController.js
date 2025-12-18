import Rating from "../models/Rating.js";
import mongoose from "mongoose";

// Get all ratings for a hotel
export const getRating = async (req, res) => {
  try {
    const { hotel } = req.query;

    if (!hotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID is required",
      });
    }

    const ratings = await Rating.find({ hotel })
      .populate('user', 'username image email') // ✅ Populate user info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      ratings,
    });
  } catch (error) {
    console.error('Error in getRating:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new rating
export const createRating = async (req, res) => {
  try {
    const { hotel, ratings, comment } = req.body;
    
    const userId = req.user?._id;

    if (!userId) {
      console.error('❌ No userId found!');
      return res.status(401).json({
        success: false,
        message: "Please login to submit a review",
      });
    }

    if (!hotel || !ratings || !ratings.overall) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID and overall rating are required",
      });
    }

    // Check if user already rated this hotel
    const existingRating = await Rating.findOne({ hotel, user: userId });

    if (existingRating) {
      // ✅ Return existing review info instead of error
      return res.status(200).json({
        success: false,
        message: "You have already rated this hotel.",
        existingReview: existingRating,
        canUpdate: true
      });
    }

    // Create new rating
    const newRating = new Rating({
      hotel,
      user: userId,
      ratings: {
        overall: ratings.overall,
        cleanliness: ratings.cleanliness || ratings.overall,
        service: ratings.service || ratings.overall,
        staff: ratings.staff || ratings.overall,
      },
      comment: comment || "",
    });

    await newRating.save();
    console.log('✅ Rating saved:', newRating._id);

    // Populate user info before sending response
    await newRating.populate('user', 'username image email');

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      rating: newRating,
    });
  } catch (error) {
    console.error('❌ Error in createRating:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update existing rating
export const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { ratings, comment } = req.body;
    const userId = req.user._id;

    const rating = await Rating.findById(id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    // Check if user owns this rating
    if (rating.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    // Update rating
    if (ratings) {
      rating.ratings = {
        overall: ratings.overall || rating.ratings.overall,
        cleanliness: ratings.cleanliness || rating.ratings.cleanliness,
        service: ratings.service || rating.ratings.service,
        staff: ratings.staff || rating.ratings.staff,
      };
    }

    if (comment !== undefined) {
      rating.comment = comment;
    }

    await rating.save();
    await rating.populate('user', 'username image email');

    res.status(200).json({
      success: true,
      message: "Review updated successfully!",
      rating,
    });
  } catch (error) {
    console.error('Error in updateRating:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete rating
export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findById(id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    // Check if user owns this rating
    if (rating.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    await Rating.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully!",
    });
  } catch (error) {
    console.error('Error in deleteRating:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get average ratings for a hotel
export const getAverageRatings = async (req, res) => {
  try {
    const { hotel } = req.query;

    if (!hotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID is required",
      });
    }

    const ratings = await Rating.find({ hotel });

    if (ratings.length === 0) {
      return res.status(200).json({
        success: true,
        averages: {
          overall: 0,
          cleanliness: 0,
          service: 0,
          staff: 0,
        },
        totalReviews: 0,
      });
    }

    const totals = ratings.reduce(
      (acc, rating) => ({
        overall: acc.overall + rating.ratings.overall,
        cleanliness: acc.cleanliness + rating.ratings.cleanliness,
        service: acc.service + rating.ratings.service,
        staff: acc.staff + rating.ratings.staff,
      }),
      { overall: 0, cleanliness: 0, service: 0, staff: 0 }
    );

    const averages = {
      overall: (totals.overall / ratings.length).toFixed(1),
      cleanliness: (totals.cleanliness / ratings.length).toFixed(1),
      service: (totals.service / ratings.length).toFixed(1),
      staff: (totals.staff / ratings.length).toFixed(1),
    };

    res.status(200).json({
      success: true,
      averages,
      totalReviews: ratings.length,
    });
  } catch (error) {
    console.error('Error in getAverageRatings:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};