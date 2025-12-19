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
      // THAY ĐỔI 1: Thêm 'flex flex-col' để quản lý bố cục dọc
      className="relative max-w-[300px] aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-lg flex flex-col group transition-shadow hover:shadow-2xl"
    >
      {/* THAY ĐỔI 2: Đổi h-48 thành h-[60%] để ảnh chiếm 60% chiều cao thẻ */}
      <div className="relative h-[60%] w-full overflow-hidden">
        <img
          src={room.images?.[0]}
          alt="hotel"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {isBestSeller && (
          <p className="absolute top-3 left-3 px-3 py-1 text-xs bg-white/90 backdrop-blur-sm font-semibold rounded-full shadow-sm">
            Best Seller
          </p>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Phần thông tin trên */}
        <div>
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-lg leading-tight line-clamp-2r-2">{room.hotel.name}</p>

              <div className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded-md shrink-0">
                <img src={assets.starIconFilled} className="w-4 h-4" />
                <span className="font-bold text-gray-700">
                  {averageRating > 0 ? averageRating : "0"}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 line-clamp-3mb-3">{room.hotel.address}</p>
        </div>

        {/* THAY ĐỔI 4: Thêm 'mt-auto' để đẩy khối giá và nút xuống tận cùng đáy thẻ */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col">
             <span className="text-xs text-gray-400">Start from</span>
             <p className="font-bold text-lg text-green-700 leading-none">
                {currency}{room.pricePerNight}
             </p>
          </div>

          <button
            className="
                px-4 py-2 text-xs font-bold rounded-full
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
