import mongoose from "mongoose";
const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    // use ObjectId to align with Hotel _id and avoid populate cast issues
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomType: { type: String, required: true }, // "Single", "Double"
    pricePerNight: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
