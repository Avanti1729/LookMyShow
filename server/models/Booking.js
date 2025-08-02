import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, ref: "User" },
    show: { type: String, required: true, ref: "User" },
    amount: { type: String, required: true, ref: "User" },
    bookedSeats: { type: Array, required: true, ref: "User" },
    isPaid: { type: Boolean, default: false },
    paymentLink: { type: String },
  },
  { timestamps: true }
);
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
