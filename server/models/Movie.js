import mongoose from "mongoose";

// Define a schema for the Movie model
const movieSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Unique ID for the movie
    title: { type: String, required: true }, // Title of the movie
    overview: { type: String, required: true }, // Movie overview/summary
    poster_path: { type: String, required: true }, // Poster image URL
    backdrop_path: { type: String, required: true }, // Backdrop image URL
    release_date: { type: Date, required: true }, // Release date (now a Date type)
    original_language: { type: String, default: "en" }, // Original language of the movie (default: English)
    tagline: { type: String }, // Tagline for the movie (optional)
    genres: { type: [String], required: true }, // Genres as an array of strings
    casts: {
      type: [
        {
          name: { type: String, required: true }, // Cast name
          character: { type: String, required: true },
          profile_path: { type: String }, // Character played by the cast
        },
      ],
      required: true,
    }, // Cast array with objects
    vote_average: { type: Number, required: true }, // Average vote score (like IMDb rating)
    runtime: { type: Number, required: true }, // Runtime in minutes
  },
  { timestamps: true } // Automatically create createdAt and updatedAt fields
);

// Create and export the Movie model
const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
