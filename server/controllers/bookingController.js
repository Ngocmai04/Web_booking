import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";
import mongoose from "mongoose";
import crypto from "crypto";

// Function to Check Availablity of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {

  try {
    // Convert room to ObjectId if it's a string
    const roomId = typeof room === 'string' ? new mongoose.Types.ObjectId(room) : room;
    
    const bookings = await Booking.find({
      room: roomId,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;

  } catch (error) {
    console.error(error.message);
    return false;
  }
};

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {

    const { room, checkInDate, checkOutDate, guests } = req.body;

    const user = req.user._id;
    const userRole = req.user?.role;

    // Get Room and Hotel data first
    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Owners cannot book rooms in a hotel they own
    if (userRole === "hotelOwner" && roomData.hotel.owner.toString() === user.toString()) {
      return res.json({ 
        success: false, 
        message: "You cannot book rooms in a hotel you own." 
      });
    }

    // Before Booking Check Availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    let totalPrice = roomData.pricePerNight;

    // Calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    // Create confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "pending",
      isEmailConfirmed: false,
      confirmationToken,
      confirmationTokenExpires,
    });

    // Confirmation URL
    const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-booking/${booking._id}/${confirmationToken}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: 'Confirm your booking - Hotel Booking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">🏨 Confirm Your Booking</h2>
          <p>Hello <strong>${req.user.username}</strong>,</p>
          <p>Thanks for your booking! Please confirm it by clicking the button below:</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Booking details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li>📋 <strong>Booking ID:</strong> ${booking._id}</li>
              <li>🏨 <strong>Hotel:</strong> ${roomData.hotel.name}</li>
              <li>📍 <strong>Address:</strong> ${roomData.hotel.address}</li>
              <li>📅 <strong>Check-in:</strong> ${booking.checkInDate.toDateString()}</li>
              <li>📅 <strong>Check-out:</strong> ${booking.checkOutDate.toDateString()}</li>
              <li>👥 <strong>Guests:</strong> ${booking.guests}</li>
              <li>💰 <strong>Total:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              ✅ Confirm Booking
            </a>
          </div>
          
          <p style="color: #ef4444; font-size: 14px;">⚠️ <strong>Note:</strong> This confirmation link expires in 24 hours. If you do not confirm, your booking will be cancelled automatically.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            If you did not make this booking, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    // Send confirmation email
    try {
      await transporter.sendMail(mailOptions);
      res.json({ 
        success: true, 
        message: "Booking created! Please check your email to confirm your booking.",
        requireConfirmation: true
      });
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
      // If email sending fails, delete the booking and return error
      await Booking.findByIdAndDelete(booking._id);
      res.json({ 
        success: false, 
        message: "Unable to send the confirmation email. Please try again later." 
      });
    }

  } catch (error) {
    console.log(error);

    res.json({ success: false, message: "Failed to create booking" });
  }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room")
      .populate("hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log("getUserBookings error:", error);
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};


export const getHotelBookings = async (req, res) => {
  try {
    const { hotelId } = req.query;

    const hotels = await Hotel.find({ owner: req.auth.userId });
    if (!hotels.length) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const selectedHotel = hotelId
      ? hotels.find((hotel) => hotel._id.toString() === hotelId)
      : hotels[0];

    if (!selectedHotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const bookings = await Booking.find({ hotel: selectedHotel._id }).populate("room hotel user").sort({ createdAt: -1 });
    // Total Bookings
    const totalBookings = bookings.length;
    // Total Revenue
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};


export const stripePayment = async (req, res) => {
  try {

    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.totalPrice;

    const { origin } = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Create Line Items for Stripe
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];

    // Create Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      },
    });
    res.json({ success: true, url: session.url });

  } catch (error) {
    res.json({ success: false, message: "Payment Failed" });
  }
}

// Confirm booking via email
// GET /api/bookings/confirm/:bookingId/:token
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId, token } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found." });
    }

    // Already confirmed?
    if (booking.isEmailConfirmed) {
      return res.json({ success: true, message: "This booking has already been confirmed.", alreadyConfirmed: true });
    }

    // Validate token
    if (booking.confirmationToken !== token) {
      return res.json({ success: false, message: "Invalid confirmation link." });
    }

    // Expired?
    if (booking.confirmationTokenExpires < new Date()) {
      // Delete expired booking
      await Booking.findByIdAndDelete(bookingId);
      return res.json({ success: false, message: "Confirmation link has expired. The booking has been cancelled." });
    }

    // Confirm booking
    booking.isEmailConfirmed = true;
    booking.status = "confirmed";
    booking.confirmationToken = undefined;
    booking.confirmationTokenExpires = undefined;
    await booking.save();

    res.json({ success: true, message: "Booking confirmed successfully!" });

  } catch (error) {
    console.log("confirmBooking error:", error);
    res.json({ success: false, message: "Confirmation failed." });
  }
};

// Resend confirmation email
// POST /api/bookings/resend-confirmation
export const resendConfirmation = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const user = req.user;

    const booking = await Booking.findById(bookingId).populate("room hotel");

    if (!booking) {
      return res.json({ success: false, message: "Booking not found." });
    }

    if (booking.user !== user._id) {
      return res.json({ success: false, message: "Access denied." });
    }

    if (booking.isEmailConfirmed) {
      return res.json({ success: false, message: "This booking has already been confirmed." });
    }

    // Generate a new token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    booking.confirmationToken = confirmationToken;
    booking.confirmationTokenExpires = confirmationTokenExpires;
    await booking.save();

    const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-booking/${booking._id}/${confirmationToken}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Confirm your booking - Hotel Booking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">🏨 Confirm Your Booking</h2>
          <p>Hello <strong>${user.username}</strong>,</p>
          <p>Please confirm your booking by clicking the button below:</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Booking details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li>📋 <strong>Booking ID:</strong> ${booking._id}</li>
              <li>🏨 <strong>Hotel:</strong> ${booking.hotel.name}</li>
              <li>📅 <strong>Check-in:</strong> ${booking.checkInDate.toDateString()}</li>
              <li>📅 <strong>Check-out:</strong> ${booking.checkOutDate.toDateString()}</li>
              <li>💰 <strong>Total:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              ✅ Confirm Booking
            </a>
          </div>
          
          <p style="color: #ef4444; font-size: 14px;">⚠️ This confirmation link expires in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Confirmation email resent." });

  } catch (error) {
    console.log("resendConfirmation error:", error);
    res.json({ success: false, message: "Failed to send email." });
  }
};
