import stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  console.log("🔥 Stripe webhook received");
  const sig = request.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("❌ Signature verification failed:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // ✅ Correct event for Stripe Checkout success
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // ✅ Directly get bookingId from metadata
      const { bookingId } = session.metadata;

      if (!bookingId) {
        console.error("⚠️ No bookingId found in metadata");
        return response.status(400).send("Missing booking ID in metadata");
      }

      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentLink: "",
      });
      await inngest.send({
        name: "app/show.booked",
        data: { bookingId },
      });
      console.log("✅ Booking marked as paid:", bookingId);
    } else {
      console.log("Unhandled event type:", event.type);
    }

    response.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    response.status(500).send("Internal Server Error");
  }
};
