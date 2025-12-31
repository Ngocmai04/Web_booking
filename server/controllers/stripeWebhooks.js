import Stripe from "stripe";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  console.log("📥 Stripe webhook received");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook signature verified. Event type:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle multiple event types
    let session;
    let bookingId;

    if (event.type === "checkout.session.completed") {
      session = event.data.object;
      console.log("💳 Checkout session completed:", session.id);
      bookingId = session?.metadata?.bookingId;
    } else if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("💳 Payment intent succeeded:", paymentIntent.id);
      bookingId = paymentIntent?.metadata?.bookingId;
      
      // Retrieve session from payment intent if needed
      if (paymentIntent.metadata?.sessionId) {
        try {
          session = await stripe.checkout.sessions.retrieve(paymentIntent.metadata.sessionId);
        } catch (err) {
          console.log("⚠️ Could not retrieve session:", err.message);
        }
      }
    } else {
      console.log("ℹ️ Unhandled event type:", event.type);
      return res.json({ received: true, message: "Event type not handled" });
    }

    console.log("🔍 Booking ID from metadata:", bookingId);

    if (!bookingId) {
      console.error("❌ Missing bookingId in metadata. Event:", event.type);
      return res.status(400).json({ 
        received: true, 
        error: "Missing bookingId in metadata" 
      });
    }

    // Validate bookingId format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      console.error("❌ Invalid bookingId format:", bookingId);
      return res.status(400).json({ 
        received: true, 
        error: "Invalid bookingId format" 
      });
    }

    // Check if booking exists before updating
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      console.error("❌ Booking not found in database:", bookingId);
      return res.status(404).json({ 
        received: true, 
        error: "Booking not found" 
      });
    }

    // Skip update if already paid
    if (existingBooking.isPaid) {
      console.log("ℹ️ Booking already paid, skipping update:", bookingId);
      return res.json({ 
        received: true, 
        message: "Booking already paid",
        bookingId: existingBooking._id.toString()
      });
    }

    console.log("📝 Existing booking status:", {
      _id: existingBooking._id.toString(),
      isPaid: existingBooking.isPaid,
      paymentMethod: existingBooking.paymentMethod,
      status: existingBooking.status,
      isEmailConfirmed: existingBooking.isEmailConfirmed,
    });

    // Update booking
    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      {
        isPaid: true,
        paymentMethod: "Stripe",
        status: "confirmed",
        isEmailConfirmed: true,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      console.error("❌ Failed to update booking:", bookingId);
      return res.status(500).json({ 
        received: true, 
        error: "Failed to update booking" 
      });
    }

    console.log("✅ Booking updated successfully:", {
      _id: updated._id.toString(),
      isPaid: updated.isPaid,
      paymentMethod: updated.paymentMethod,
      status: updated.status,
      isEmailConfirmed: updated.isEmailConfirmed,
      eventType: event.type,
    });

    return res.json({ 
      received: true, 
      message: "Booking updated successfully",
      bookingId: updated._id.toString()
    });
  } catch (e) {
    console.error("❌ Webhook handler error:", e);
    console.error("Error stack:", e.stack);
    // Stripe sẽ retry nếu bạn trả 500
    return res.status(500).json({ 
      received: true, 
      error: "Server error",
      message: e.message 
    });
  }
};
