import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import React from 'react'
import backgroundImage from '../assets/backgroundImage.jpg';
import { useNavigate } from 'react-router-dom';

const MovieSection = () => {
  const navigate = useNavigate()
  return (
    <div
      className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen'
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>Interstellar</h1>
      <div className='flex items-center gap-4 text-gray-300'>
        <span>Adventure | Sci-Fi</span>
        <div className='flex items-center gap-1'>
            <CalendarIcon className='w-4.5 h-4.5'/> 2014
        </div>
        <div className='flex items-center gap-1'>
            <ClockIcon className='w-4.5 h-4.5'/> 2h 49m
        </div>
      </div>
      <p className='max-w-md text-gray-300'>Set in a dystopian future where Earth is suffering from catastrophic blight and famine, the film follows a group of astronauts who travel through a wormhole near Saturn in search of a new home for mankind.</p>
      <button onClick={()=>navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
        Explore Movies
        <ArrowRight className='w-5 h-5'/>
      </button>
    </div>

  )
}

export default MovieSection
