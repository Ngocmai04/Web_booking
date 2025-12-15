import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import Title from './Title';
import HotelCard from './HotelCard';

const RecommendedHotels = () => {

    const { rooms, searchedCities } = useAppContext();

    const [recommended, setRecommended] = useState([]);

    const filterHotels = () => {
        const filteredHotels = rooms.slice().filter(room => room && room.hotel && searchedCities.includes(room.hotel.city));
        setRecommended(filteredHotels);
    }

    useEffect(() => {
        filterHotels()
    }, [rooms, searchedCities])

    return recommended.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-red-50 to-green-50'>
            {/* Decorative Christmas elements */}
            <div className="text-4xl mb-6 opacity-70">
                🎄 ❄️ 🎁
            </div>

            <Title
                title="🎅 Recommended Christmas Stays"
                subTitle="Discover our handpicked selection of exceptional properties perfect for your holiday season, offering festive luxury and unforgettable experiences."
            />

            <div className='flex flex-wrap items-center justify-center gap-6 mt-16'>
                {recommended.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>
        </div>
    )
}

export default RecommendedHotels