import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import User from "./models/User.js"; // ✅ import your User model
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// ✅ Connect to MongoDB with error handling
try {
  await connectDB();
  console.log("✅ Connected to the database");
} catch (error) {
  console.error("❌ Failed to connect to the database", error);
  process.exit(1); // Exit the process if the DB connection fails
}

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// ✅ Root route
app.get("/", (req, res) => res.send("Server is Live!"));
// ✅ Inngest event handler route
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/show", showRouter); // Changed from "/api/show" to "/show"
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);

// ✅ TEST route to manually create a user in MongoDB (only in development)
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

// ✅ Start the server
app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
