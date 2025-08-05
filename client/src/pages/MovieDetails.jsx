import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();
  const [error, setError] = useState(false);

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      console.log("🔍 DEBUG Show API Response:", data);
      if (data.success) {
        // ✅ Save both movie and dateTime properly
        setShow({
          movie: data.movie,
          showDateTime: data.dateTime || {},
        });
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");
      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  if (error) {
    return (
      <div className="text-white p-10">
        Something went wrong, please try again later.
      </div>
    );
  }

  if (!show || !show.movie) {
    return <Loading />;
  }

  const movie = show.movie;

  const genres = Array.isArray(movie.genres)
    ? movie.genres.map((g) => (typeof g === "string" ? g : g.name)).join(", ")
    : "Unknown";

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const castList = movie.casts || [];

  return (
    <div className="px-6 md:px-16 lg:px-32 xl:px-44 pt-32 md:pt-48 pb-16">
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-[90rem] mx-auto">
        <img
          src={image_base_url + movie.poster_path}
          alt={movie.title}
          className="rounded-xl w-[360px] h-[520px] object-cover flex-shrink-0"
        />

        <div className="flex flex-col justify-start flex-grow gap-4">
          <BlurCircle top="100px" left="450px" />
          <p className="text-primary font-semibold text-sm">ENGLISH</p>

          <h1 className="text-5xl font-bold">{movie.title}</h1>

          <div className="flex items-center gap-2 text-gray-300 text-base">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie.vote_average?.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-1 text-sm leading-relaxed max-w-3xl">
            {movie.overview}
          </p>

          <p className="text-sm text-gray-300 font-medium">
            {timeFormat(movie.runtime)} ⸰ {genres} ⸰ {releaseYear}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>
            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  favoriteMovies.find((fav) => fav._id === id)
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Cast Section with fallback */}
      <p className="text-lg font-medium mt-20">Your Favourite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4 mx-auto">
          {castList.length > 0 ? (
            castList.slice(0, 10).map((cast) => (
              <div key={cast._id || cast.name} className="text-center">
                {cast.profile_path ? (
                  <img
                    src={image_base_url + cast.profile_path}
                    alt={cast.name}
                    className="rounded-full h-20 md:h-20 aspect-square object-cover mx-auto"
                  />
                ) : (
                  <div className="rounded-full h-20 md:h-20 aspect-square bg-gray-700 flex items-center justify-center text-white mx-auto">
                    {cast.name.charAt(0)}
                  </div>
                )}
                <p className="font-medium text-xs mt-3">{cast.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">
              No cast information available.
            </p>
          )}
        </div>
      </div>

      {/* ✅ Pass correct dateTime to DateSelect */}
      <DateSelect dateTime={show.showDateTime || {}} id={id} />

      <p className="text-lg font-medium mt-20 mb-8 text-center">
        You May Also Like
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {shows.slice(0, 4).map((movie, index) => (
          <MovieCard key={movie._id || index} movie={movie.movie || movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
