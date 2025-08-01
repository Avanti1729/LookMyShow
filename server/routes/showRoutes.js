import express from "express";
import { getNowPlayingMovies } from "../controllers/showController.js"; // Import your controller
const showRouter = express.Router();

// Endpoint to get now-playing movies
showRouter.get("/now-playing", getNowPlayingMovies);

export default showRouter; // Export the router for use in server.js
