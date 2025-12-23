import mongoose from "mongoose";
import crypto from "crypto";
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    user: { type: String, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Pay At Hotel",
    },
    isPaid: { type: Boolean, default: false },
    // Token xác thực email
    confirmationToken: { type: String },
    confirmationTokenExpires: { type: Date },
    isEmailConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
