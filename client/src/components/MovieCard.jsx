import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();
  console.log("DEBUG Movie in MovieCard:", movie);

  if (!movie) return null; // ✅ Safety: avoid rendering undefined

  // ✅ If genres are array of strings, use them directly
  const genres = Array.isArray(movie.genres) ? movie.genres.slice(0, 2) : [];
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-[240px] sm:w-[260px] md:w-[280px]">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={image_base_url + (movie.backdrop_path || movie.poster_path || "")}
        alt={movie.title || "Movie"}
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title || "Untitled"}</p>
      <p className="text-sm text-gray-400 mt-2">
        {releaseYear} ⸰ {genres.join(" | ") || "Unknown"} ⸰{" "}
        {timeFormat(movie.runtime || 0)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>
        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {rating}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
