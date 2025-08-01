import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import User from "./models/User.js"; // ✅ import your User model

const app = express();
const port = 3000;

// ✅ Connect to MongoDB
await connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// ✅ Root route
app.get("/", (req, res) => res.send("Server is Live!"));

// ✅ Inngest event handler route
app.use("/api/inngest", serve({ client: inngest, functions }));

// ✅ TEST route to manually create a user in MongoDB
app.get("/test-user", async (req, res) => {
  try {
    const newUser = await User.create({
      _id: "manual123",
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

// ✅ Start the server
app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
