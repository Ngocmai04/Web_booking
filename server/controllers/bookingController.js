import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";
import mongoose from "mongoose";
import crypto from "crypto";

// Brevo Email Service
import {
  sendConfirmBookingEmail,
  sendBookingConfirmedEmail,
} from "../services/email/bookingEmail.service.js";

/* --------------------------------------------------
   Utils: Check availability
-------------------------------------------------- */
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const roomId =
      typeof room === "string" ? new mongoose.Types.ObjectId(room) : room;

    const bookings = await Booking.find({
      room: roomId,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    return bookings.length === 0;
  } catch (error) {
    console.error("checkAvailability error:", error.message);
    return false;
  }
};

/* --------------------------------------------------
   POST /api/bookings/check-availability
-------------------------------------------------- */
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------
   POST /api/bookings/book
-------------------------------------------------- */
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests, paymentMethod } = req.body;
    const user = req.user;

    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    if (
      user.role === "hotelOwner" &&
      roomData.hotel.owner.toString() === user._id.toString()
    ) {
      return res.json({
        success: false,
        message: "You cannot book rooms in a hotel you own.",
      });
    }

    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });
    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // Calculate price
    const nights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = roomData.pricePerNight * nights;

    // Create confirmation token
    const confirmationToken = crypto.randomBytes(32).toString("hex");

    const booking = await Booking.create({
      user: user._id,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "pending",
      isEmailConfirmed: false,
      confirmationToken,
      confirmationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      paymentMethod: paymentMethod || "Pay At Hotel",
    });

    const confirmUrl = `${process.env.CLIENT_URL}/confirm-booking/${booking._id}/${confirmationToken}`;

    const userEmail =
      user.email ||
      req.auth?.user?.primaryEmailAddress?.emailAddress ||
      req.auth?.user?.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      await Booking.findByIdAndDelete(booking._id);
      return res.json({
        success: false,
        message: "No email found for your account.",
      });
    }

    // Send confirm email via Brevo
    await sendConfirmBookingEmail({
      to: userEmail,
      username: user.username,
      booking,
      hotelName: roomData.hotel.name,
      confirmUrl,
    });

    res.json({
      success: true,
      message: "Booking created! Please check your email to confirm.",
      requireConfirmation: true,
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("createBooking error:", error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};

/* --------------------------------------------------
   GET /api/bookings/user
-------------------------------------------------- */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room")
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("getUserBookings error:", error);
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

/* --------------------------------------------------
   GET /api/bookings/hotel
-------------------------------------------------- */
export const getHotelBookings = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const hotels = await Hotel.find({ owner: req.auth.userId });

    if (!hotels.length) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const selectedHotel = hotelId
      ? hotels.find((h) => h._id.toString() === hotelId)
      : hotels[0];

    if (!selectedHotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const bookings = await Booking.find({ hotel: selectedHotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

/* --------------------------------------------------
   POST /api/bookings/stripe-payment
-------------------------------------------------- */
export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.json({ 
        success: false, 
        message: "Booking ID is required" 
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");
    if (!roomData) {
      return res.json({ 
        success: false, 
        message: "Room not found" 
      });
    }

    if (!roomData.hotel) {
      return res.json({ 
        success: false, 
        message: "Hotel not found" 
      });
    }

    // Validate total price
    if (!booking.totalPrice || booking.totalPrice <= 0) {
      return res.json({ 
        success: false, 
        message: "Invalid booking price" 
      });
    }

    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY is not configured");
      return res.json({ 
        success: false, 
        message: "Payment service is not configured" 
      });
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    
    // Use CLIENT_URL if origin header is not available
    const { origin } = req.headers;
    const baseUrl = origin || process.env.CLIENT_URL || "http://localhost:5173";
    
    if (!baseUrl) {
      return res.json({ 
        success: false, 
        message: "Client URL is not configured" 
      });
    }

    // Update payment method
    await Booking.findByIdAndUpdate(bookingId, {
      paymentMethod: "Stripe",
    });

    // Create Stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: roomData.hotel.name || "Hotel Booking",
              description: `Room booking from ${new Date(booking.checkInDate).toLocaleDateString()} to ${new Date(booking.checkOutDate).toLocaleDateString()}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Ensure it's an integer
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/my-bookings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/my-bookings?payment=cancelled`,
      metadata: {
        bookingId: bookingId.toString(), // Ensure it's a string
      },
      payment_intent_data: {
        metadata: {
          bookingId: bookingId.toString(),
        },
      },
    });

    console.log("✅ Stripe checkout session created:", session.id);

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("❌ Stripe payment error:", error);
    console.error("Error details:", {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      stack: error.stack,
    });
    
    res.json({ 
      success: false, 
      message: error.message || "Payment Failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

/* --------------------------------------------------
   POST /api/bookings/verify-payment
   Verify payment status from Stripe and update database
-------------------------------------------------- */
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId, sessionId } = req.body;

    if (!bookingId && !sessionId) {
      return res.json({ 
        success: false, 
        message: "Booking ID or Session ID is required" 
      });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.json({ 
        success: false, 
        message: "Payment service is not configured" 
      });
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    let session;
    let bookingIdToUpdate = bookingId;

    // If sessionId is provided, get session and extract bookingId
    if (sessionId) {
      try {
        session = await stripeInstance.checkout.sessions.retrieve(sessionId);
        bookingIdToUpdate = session?.metadata?.bookingId || bookingId;
        console.log("📋 Retrieved session:", session.id, "Payment status:", session.payment_status);
      } catch (error) {
        console.error("❌ Error retrieving session:", error.message);
        return res.json({ 
          success: false, 
          message: "Failed to retrieve payment session" 
        });
      }
    }

    if (!bookingIdToUpdate) {
      return res.json({ 
        success: false, 
        message: "Booking ID not found" 
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingIdToUpdate);
    if (!booking) {
      return res.json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    // If session was retrieved, check payment status
    if (session) {
      if (session.payment_status === "paid") {
        // Update booking if payment is confirmed
        const updated = await Booking.findByIdAndUpdate(
          bookingIdToUpdate,
          {
            isPaid: true,
            paymentMethod: "Stripe",
            status: "confirmed",
            isEmailConfirmed: true,
          },
          { new: true, runValidators: true }
        );

        console.log("✅ Payment verified and booking updated:", {
          bookingId: updated._id.toString(),
          isPaid: updated.isPaid,
          sessionId: session.id,
        });

        return res.json({ 
          success: true, 
          message: "Payment verified and booking updated",
          booking: {
            _id: updated._id,
            isPaid: updated.isPaid,
            paymentMethod: updated.paymentMethod,
            status: updated.status,
          }
        });
      } else {
        return res.json({ 
          success: false, 
          message: `Payment status: ${session.payment_status}`,
          paymentStatus: session.payment_status
        });
      }
    }

    // If no session, just return current booking status
    return res.json({ 
      success: true, 
      booking: {
        _id: booking._id,
        isPaid: booking.isPaid,
        paymentMethod: booking.paymentMethod,
        status: booking.status,
      }
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    return res.json({ 
      success: false, 
      message: error.message || "Failed to verify payment" 
    });
  }
};

/* --------------------------------------------------
   PUT /api/bookings/mark-paid/:bookingId
   Hotel owner marks Pay At Hotel booking as paid
-------------------------------------------------- */
export const markBookingAsPaid = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const user = req.user;

    // Find booking
    const booking = await Booking.findById(bookingId).populate("hotel");
    if (!booking) {
      return res.json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    // Check if user is the hotel owner
    if (booking.hotel.owner.toString() !== user._id.toString()) {
      return res.json({ 
        success: false, 
        message: "You are not authorized to update this booking" 
      });
    }

    // Only allow marking paid for Pay At Hotel bookings
    if (booking.paymentMethod !== "Pay At Hotel") {
      return res.json({ 
        success: false, 
        message: "This booking is not a Pay At Hotel booking" 
      });
    }

    // Check if already paid
    if (booking.isPaid) {
      return res.json({ 
        success: false, 
        message: "This booking is already marked as paid" 
      });
    }

    // Update booking
    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      {
        isPaid: true,
        status: "confirmed",
      },
      { new: true, runValidators: true }
    );

    console.log("✅ Booking marked as paid by hotel owner:", {
      bookingId: updated._id.toString(),
      hotelId: booking.hotel._id.toString(),
      ownerId: user._id.toString(),
    });

    return res.json({ 
      success: true, 
      message: "Booking marked as paid successfully",
      booking: {
        _id: updated._id,
        isPaid: updated.isPaid,
        paymentMethod: updated.paymentMethod,
        status: updated.status,
      }
    });
  } catch (error) {
    console.error("❌ Mark booking as paid error:", error);
    return res.json({ 
      success: false, 
      message: error.message || "Failed to mark booking as paid" 
    });
  }
};

/* --------------------------------------------------
   GET /api/bookings/confirm/:bookingId/:token
-------------------------------------------------- */
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId, token } = req.params;

    const booking = await Booking.findById(bookingId).populate("hotel user");
    if (!booking)
      return res.json({ success: false, message: "Booking not found." });

    if (booking.isEmailConfirmed) {
      return res.json({
        success: true,
        message: "This booking has already been confirmed.",
      });
    }

    if (booking.confirmationToken !== token) {
      return res.json({
        success: false,
        message: "Invalid confirmation link.",
      });
    }

    if (booking.confirmationTokenExpires < new Date()) {
      await Booking.findByIdAndDelete(bookingId);
      return res.json({
        success: false,
        message: "Confirmation link expired. Booking cancelled.",
      });
    }

    booking.isEmailConfirmed = true;
    booking.status = "confirmed";
    booking.confirmationToken = undefined;
    booking.confirmationTokenExpires = undefined;
    await booking.save();

    // Send confirmed email
    await sendBookingConfirmedEmail({
      to: booking.user.email,
      username: booking.user.username,
      booking,
      hotelName: booking.hotel.name,
    });

    res.json({ success: true, message: "Booking confirmed successfully!" });
  } catch (error) {
    console.error("confirmBooking error:", error);
    res.json({ success: false, message: "Confirmation failed." });
  }
};

/* --------------------------------------------------
   POST /api/bookings/resend-confirmation
-------------------------------------------------- */
export const resendConfirmation = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const user = req.user;

    const booking = await Booking.findById(bookingId).populate("hotel");
    if (!booking)
      return res.json({ success: false, message: "Booking not found." });

    if (booking.user.toString() !== user._id.toString()) {
      return res.json({ success: false, message: "Access denied." });
    }

    if (booking.isEmailConfirmed) {
      return res.json({
        success: false,
        message: "This booking has already been confirmed.",
      });
    }

    booking.confirmationToken = crypto.randomBytes(32).toString("hex");
    booking.confirmationTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );
    await booking.save();

    const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-booking/${booking._id}/${confirmationToken}`;

    await sendConfirmBookingEmail({
      to: user.email,
      username: user.username,
      booking,
      hotelName: booking.hotel.name,
      confirmUrl,
    });

    res.json({ success: true, message: "Confirmation email resent." });
  } catch (error) {
    console.error("resendConfirmation error:", error);
    res.json({ success: false, message: "Failed to send email." });
  }
};
