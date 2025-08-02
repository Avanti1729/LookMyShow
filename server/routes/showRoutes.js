import express from "express";
import {
  addShow,
  getNowPlayingMovies,
  getShow,
  getShows,
} from "../controllers/showController.js"; // Import your controller
const showRouter = express.Router();

// Endpoint to get now-playing movies
showRouter.get("/now-playing", getNowPlayingMovies);
showRouter.post("/add", addShow);
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getShow);
export default showRouter; // Export the router for use in server.js
