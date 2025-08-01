import mongoose from "mongoose";
const showSchema = new mongoose.Schema(
  {
    movie: { type: String, required: true, ref: "Movie" },
    showDateTime: { type: Date, required: true },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
