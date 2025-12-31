import React from 'react'
import { useAppContext } from '../context/AppContext'
import Title from './Title'
import HotelCard from './HotelCard'

const FeaturedDestination = () => {
    const { rooms, navigate } = useAppContext()

    // Filter rooms to only include those with valid hotel data
    const validRooms = rooms.filter(room => room && room.hotel)

    return (
        validRooms.length > 0 && (
            <div className="flex flex-col items-center px-4 sm:px-6 md:px-16 lg:px-24 py-12 sm:py-16 md:py-24 relative overflow-hidden bg-white">
                {/* Decorative Christmas divider */}
                <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl">
                    <span>❄️</span>
                    <span>🎄</span>
                    <span>⭐</span>
                    <span>🎁</span>
                    <span>❄️</span>
                </div>

                <Title
                    title="Featured Christmas Destinations"
                    subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable holiday experiences."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 w-full max-w-7xl">
                    {validRooms.slice(0, 4).map((room, index) => (
                        <HotelCard key={room._id} room={room} index={index} />
                    ))}
                </div>

                <button
                    onClick={() => {
                        navigate('/rooms')
                        scrollTo(0, 0)
                    }}
                    className="mt-8 sm:mt-12 md:mt-16 mb-4 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-bold tracking-wide rounded-xl bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all"
                >
                    🎁 View All Destinations
                </button>
            </div>
        )
    )
}

export default FeaturedDestination