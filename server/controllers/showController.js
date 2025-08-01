import axios from "axios";

export const getNowPlayingMovies = async (req, res) => {
  try {
    // Send a request to The Movie DB API for now-playing movies
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }, // Ensure the API key is in your .env file
      }
    );

    // Extract movie data
    const movies = data.results;

    // Return successful response with the movie data
    return res.json({ success: true, movies });
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching now playing movies:", error);

    // Provide a more user-friendly error response
    return res.status(500).json({
      success: false,
      message: error.response
        ? error.response.data.status_message
        : error.message,
    });
  }
};
