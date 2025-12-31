import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const HotelCard = ({ room }) => {
  const { currency } = useAppContext();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!room || !room.hotel?._id) return;

    const fetchRating = async () => {
      try {
        const res = await axios.get(
          `/api/ratings/average?hotel=${room.hotel._id}`
        );

        if (res.data.success) {
          setAverageRating(Number(res.data.averages.overall));
          setReviewCount(res.data.totalReviews);
        }
      } catch (err) {
        console.error("Fetch rating failed", err);
      }
    };

    fetchRating();
  }, [room]);

  if (!room || !room.hotel) return null;

  const isBestSeller = reviewCount >= 5;

  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-lg flex flex-col group transition-shadow hover:shadow-2xl mx-auto"
    >
      {/* Image Section - 55% height on mobile, 60% on larger screens */}
      <div className="relative h-[55%] sm:h-[60%] w-full overflow-hidden">
        <img
          src={room.images?.[0]}
          alt="hotel"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {isBestSeller && (
          <p className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-white/90 backdrop-blur-sm font-semibold rounded-full shadow-sm">
            Best Seller
          </p>
        )}
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Hotel Info */}
        <div>
            <div className="flex justify-between items-start gap-2 mb-1 sm:mb-2">
              <p className="font-bold text-sm sm:text-lg leading-tight line-clamp-2 flex-1">{room.hotel.name}</p>

              <div className="flex items-center gap-1 text-xs sm:text-sm bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shrink-0">
                <img src={assets.starIconFilled} className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-bold text-gray-700">
                  {averageRating > 0 ? averageRating : "0"}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2 sm:mb-3">{room.hotel.address}</p>
        </div>

        {/* Price and Book Button */}
        <div className="flex justify-between items-center mt-auto pt-2 sm:pt-3 border-t border-gray-100">
          <div className="flex flex-col">
             <span className="text-[10px] sm:text-xs text-gray-400">Start from</span>
             <p className="font-bold text-base sm:text-lg text-green-700 leading-none">
                {currency}{room.pricePerNight}
             </p>
          </div>

          <button
            className="
                px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold rounded-full
                border border-red-400
                text-red-700 bg-red-50
                transition-all duration-300
                hover:text-white hover:border-transparent
                hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-600
                hover:shadow-[0_4px_15px_rgba(239,68,68,0.35)]
                hover:-translate-y-0.5
                active:scale-95
                flex-shrink-0
            "
          >
            🎁 Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
