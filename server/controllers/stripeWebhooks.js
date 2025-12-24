import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks
// POST /api/stripe
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Getting Session Metadata
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { bookingId } = session.data[0].metadata;

    // Mark Payment as Paid and update status to confirmed
    await Booking.findByIdAndUpdate(bookingId, { 
      isPaid: true, 
      paymentMethod: "Stripe",
      status: "confirmed",
      isEmailConfirmed: true // Also confirm email since payment is done
    });
    
    console.log(`✅ Booking ${bookingId} payment successful - Status updated to confirmed`);
  } else {
    console.log("Unhandled event type :", event.type);
  }

  response.json({ received: true });
};
