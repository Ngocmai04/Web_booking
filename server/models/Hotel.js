import mongoose from "mongoose";
const { Schema } = mongoose;

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    owner: { type: String, ref: "User", required: true },
    city: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    isApproved: { type: Boolean, default: false }, // Admin approval required
    isActive: { type: Boolean, default: true }, // Admin can deactivate hotels
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
