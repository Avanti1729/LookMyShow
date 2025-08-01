// configs/db.js
import mongoose from "mongoose";

mongoose.connection.on("connected", () => {
  console.log("Database connected");
});

mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    // Already connected
    return;
  }
  try {
    const uri = process.env.MONGODB_URI.endsWith("/quickshow")
      ? process.env.MONGODB_URI
      : `${process.env.MONGODB_URI}/quickshow`;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  }
};

export default connectDB;
