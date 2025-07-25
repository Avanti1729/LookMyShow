import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard'; 
import Loading from '../components/Loading'; 

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [error, setError] = useState(false);

  const getShow = async () => {
    try {
      const found = dummyShowsData.find((show) => show._id === id);
      if (!found) {
        setShow(null);
        return;
      }
      setShow({
        movie: found,
        dateTime: dummyDateTimeData,
      });
    } catch (error) {
      setError(true);
      setShow(null);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  if (error) {
    return <div className="text-white p-10">Something went wrong, please try again later.</div>;
  }

  if (!show || !show.movie) {
    return <Loading />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-32 xl:px-44 pt-32 md:pt-48 pb-16">
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-[90rem] mx-auto">
        <img
          src={show.movie?.poster_path}
          alt={show.movie?.title}
          className="rounded-xl w-[360px] h-[520px] object-cover flex-shrink-0"
        />

        <div className="flex flex-col justify-start flex-grow gap-4">
          <BlurCircle top="100px" left="450px" />
          <p className="text-primary font-semibold text-sm">ENGLISH</p>

          <h1 className="text-5xl font-bold">{show.movie?.title}</h1>

          <div className="flex items-center gap-2 text-gray-300 text-base">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie?.vote_average?.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-1 text-sm leading-relaxed max-w-3xl">
            {show.movie?.overview}
          </p>

          <p className="text-sm text-gray-300 font-medium">
            {timeFormat(show.movie?.runtime)} ⸰{" "}
            {show.movie?.genres?.map((genre) => genre.name).join(", ")} ⸰{" "}
            {show.movie?.release_date?.split("-")[0]}
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
            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-lg font-medium mt-20">Your Favourite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4 mx-auto">
          {show.movie?.casts?.filter((cast) => cast.profile_path && cast.name).slice(0, 10).map((cast) => (
            <div key={cast.id || cast.name} className="text-center">
              <img
                src={cast.profile_path}
                alt={cast.name}
                className="rounded-full h-20 md:h-20 aspect-square object-cover mx-auto"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />
      
      <p className="text-lg font-medium mt-20 mb-8 text-center">You May Also Like</p>
        <div className="flex flex-wrap justify-center gap-8"> {/* Center the items here */}
            {dummyShowsData.slice(0, 4).map((movie, index) => (
            <MovieCard key={movie._id || index} movie={movie} />
              ))}
        </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {navigate('/movies'); scrollTo(0,0)}}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
