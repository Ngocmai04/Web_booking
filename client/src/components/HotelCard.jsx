import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const HotelCard = ({ room, index }) => {

    const { currency } = useAppContext();

    // Prevent rendering if room or hotel data is missing
    if (!room || !room.hotel) {
        return null;
    }

    return (
        <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0, 0)} key={room._id} className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-emerald-900 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'>
            <img src={room.images[0]} alt="hotel-img" draggable="false" />
            {index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-emerald-800 font-medium rounded-full'>Best Seller</p>}
            <div className="p-4 pt-5">
                <div className="flex items-center justify-between">
                    <p className="font-playfair text-xl font-medium text-red-700">
                        {room.hotel.name}
                    </p>
                    <div className="flex items-center gap-1">
                        <img src={assets.starIconFilled} alt="star-icon" /> 4.5
                    </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{room.hotel.address}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p>
                        <span className="text-xl font-semibold text-green-700">
                            {currency}{room.pricePerNight}
                        </span>
                        <span className="text-sm text-gray-600"> / night</span>
                    </p>

                    <button
                        className="
        relative overflow-hidden
        px-5 py-2 text-sm font-semibold rounded-full
        border border-red-400
        text-red-700 bg-white
        transition-all duration-300
        hover:text-white hover:border-transparent
        hover:bg-gradient-to-r hover:from-red-600 hover:to-green-600
        hover:shadow-[0_0_15px_rgba(239,68,68,0.45)]
        hover:scale-105
      "
                    >
                        🎁 Book Now
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard