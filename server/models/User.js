import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk user ID
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"], // Validate email format
    },
    image: {
      type: String,
      required: false, // Optional image
      default: "https://example.com/default-avatar.png", // Optional: default image URL if no image is provided
    },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
