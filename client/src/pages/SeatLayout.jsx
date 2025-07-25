import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  const getShow = async () => {
    const foundShow = dummyShowsData.find((show) => show._id === id);
    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData,
      });
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a time first");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-4 items-center mt-2">
      <span className="w-4 text-sm text-gray-400">{row}</span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer transition ${
                selectedSeats.includes(seatId) ? 'bg-primary text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    getShow();
  }, [id, date]);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Available Timing */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime?.[date]?.length > 0 ? (
            show.dateTime[date].map((item) => (
              <div
                key={item.time}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.time === item.time
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
                onClick={() => setSelectedTime(item)}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <p className="px-6 py-4 text-sm text-red-400">
              No showtimes available for this date.
            </p>
          )}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="relative flex-1 flex flex-col items-center text-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="0" left="0" />
        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

        {/* Seat Grid */}
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          {groupRows.map((group, index) => (
            <div key={index} className="flex gap-6 mb-4">
              {group.map((row) => renderSeats(row))}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button onClick={() => navigate('/my-bookings')}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed to CheckOut
          <ArrowRightIcon strokeWidth={3} className='w-4 h-4'/>
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
