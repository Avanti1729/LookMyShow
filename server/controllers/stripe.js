import { buffer } from "micro";
import stripe from "stripe";
import Booking from "../models/Booking.js";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // ⭐️ IMPORTANT
  },
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).end("Method Not Allowed");
  }

  const sig = request.headers["stripe-signature"];
  const buf = await buffer(request);
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Signature verification failed:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { bookingId } = session.metadata;

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });

        console.log("✅ Booking updated:", bookingId);
        break;
      }

      default:
        console.log("Unhandled event type: ", event.type);
    }

    return response.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error", err);
    return response.status(500).send("Internal Server Error");
  }
}
