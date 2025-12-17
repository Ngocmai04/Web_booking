import mongoose from "mongoose";
const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    hotel: {
      type: String,
      ref: "Hotel",
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    ratings: {
      overall: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
      },
      service: {
        type: Number,
        min: 1,
        max: 5,
      },
      staff: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
