import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import toast from "react-hot-toast";

import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UsersIcon,
  StarIcon,
} from "lucide-react";
import BlurCircle from "../../components/BlurCircle";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const appCtx = useAppContext() || {};
  const { axios, getToken, user = null, image_base_url } = appCtx;

  console.log("DEBUG user:", user);

  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      console.log("DEBUG token:", token);
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("DEBUG dashboardData:", data);

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    console.log("DEBUG: No user detected");
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <p className="text-lg font-medium text-gray-400">
          Please log in to view the dashboard.
        </p>
      </div>
    );
  }

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0px" />
        <div className="flex flex-wrap gap-4 w-full">
          {/* Dashboard cards */}
          {[
            {
              title: "Total Bookings",
              value: dashboardData.totalBookings || "0",
              icon: ChartLineIcon,
            },
            {
              title: "Total Revenue",
              value: currency + (dashboardData.totalRevenue || "0"),
              icon: CircleDollarSignIcon,
            },
            {
              title: "Active Shows",
              value: dashboardData.activeShows.length || "0",
              icon: PlayCircleIcon,
            },
            {
              title: "Total Users",
              value: dashboardData.totalUser || "0",
              icon: UsersIcon,
            },
          ].map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-primary/25 border border-primary/80 rounded-md max-w-50 w-full"
            >
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-lg font-medium">Active Shows</p>

      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="-10%" />

        {dashboardData.activeShows.length > 0 ? (
          dashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/30 border border-primary/20 hover:-translate-y-1 transition duration-300"
            >
              <img
                src={image_base_url + show.movie.poster_path}
                alt={show.movie.title}
                className="h-60 w-full object-cover"
              />

              <p className="font-medium p-2 truncate">{show.movie.title}</p>

              <div className="flex items-center justify-between px-2">
                <p className="text-lg font-medium">
                  {currency} {show.showPrice}
                </p>

                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {show.movie.vote_average.toFixed(1)}
                </p>
              </div>

              <p className="px-2 pt-2 text-sm text-gray-500">
                {dateFormat(show.showDateTime)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-4">No active shows available.</p>
        )}
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Dashboard;
