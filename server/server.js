import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import User from "./models/User.js";

import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";

import { stripeWebhooks } from "./controllers/stripe.js";

const app = express();
const port = process.env.PORT || 3000;

// ✅ Connect to DB
await connectDB();

// ✅ Stripe Webhook route — MUST come before express.json()
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// ✅ Middleware (order matters!)
app.use(express.json()); // Only AFTER webhook
app.use(cors());
app.use(clerkMiddleware());

// ✅ API Routes
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

// ✅ TEST Route for manual user creation (optional)
if (process.env.NODE_ENV === "development") {
  app.get("/test-user", async (req, res) => {
    try {
      const newUser = await User.create({
        _id: "manual1729",
        name: "Manual User",
        email: "manual@example.com",
        image: "https://example.com/avatar.png",
      });
      console.log("✅ Manual user inserted:", newUser);
      res.json({ success: true, user: newUser });
    } catch (err) {
      console.error("❌ Error inserting manual user:", err);
      res.status(500).json({ error: err.message });
    }
  });
}

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ success: false, message: err.message });
});

// ✅ Start server
app.listen(port, () =>
  console.log(`🚀 Server listening at http://localhost:${port}`)
);
