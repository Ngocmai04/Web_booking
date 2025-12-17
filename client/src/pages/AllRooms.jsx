import { useState, useMemo, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import StarRating from '../components/StarRating'
import { useSearchParams } from 'react-router-dom'

const CheckBox = ({ label, selected = true, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton = ({ label, selected = true, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input type="radio" name="sortOption" checked={selected} onChange={() => onChange(label)} />
            <span className="font-light select-none">{label}</span>
        </label>
    );
}

const AllRooms = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const { facilityIcons, navigate, currency, axios, hotels } = useAppContext();
    const [openFilters, setOpenFilters] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState({
        roomType: [],
        priceRange: [],
    });
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [hotelRooms, setHotelRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);

    const destination = searchParams.get('destination') || '';

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite",
    ];

    const priceRanges = [
        '0 to 500',
        '500 to 1000',
        '1000 to 2000',
        '2000 to 3000',
    ];

    const sortOptions = [
        "Price Low to High",
        "Price High to Low",
        "Newest First"
    ];

    const handleFilterChange = (checked, value, type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (checked) {
                updatedFilters[type].push(value);
            } else {
                updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
            }
            return updatedFilters;
        });
    }

    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption);
    }

    const matchesRoomType = (room) => {
        return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType);
    };

    const matchesPriceRange = (room) => {
        return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some(range => {
            const [min, max] = range.split(' to ').map(Number);
            return room.pricePerNight >= min && room.pricePerNight <= max;
        });
    };

    const sortRooms = (a, b) => {
        if (selectedSort === 'Price Low to High') {
            return a.pricePerNight - b.pricePerNight;
        }
        if (selectedSort === 'Price High to Low') {
            return b.pricePerNight - a.pricePerNight;
        }
        if (selectedSort === 'Newest First') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    };

    const filteredHotels = useMemo(() => {
        return hotels.filter((hotel) =>
            !destination || hotel.city.toLowerCase().includes(destination.toLowerCase())
        );
    }, [hotels, destination]);

    useEffect(() => {
        if (filteredHotels.length && !selectedHotelId) {
            setSelectedHotelId(filteredHotels[0]._id);
        }

        if (!filteredHotels.length) {
            setSelectedHotelId('');
            setHotelRooms([]);
        }
    }, [filteredHotels, selectedHotelId]);

    useEffect(() => {
        const fetchHotelRooms = async () => {
            if (!selectedHotelId) return;
            setLoadingRooms(true);
            try {
                const { data } = await axios.get('/api/rooms', { params: { hotelId: selectedHotelId } });
                if (data.success) {
                    setHotelRooms(data.rooms);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingRooms(false);
            }
        }

        fetchHotelRooms();
    }, [selectedHotelId, axios]);

    const filteredRooms = useMemo(() => {
        return hotelRooms
            .filter(room => matchesRoomType(room) && matchesPriceRange(room))
            .sort(sortRooms);
    }, [hotelRooms, selectedFilters, selectedSort]);

    const clearFilters = () => {
        setSelectedFilters({
            roomType: [],
            priceRange: [],
        });
        setSelectedSort('')
        setSearchParams({});
    }

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='w-full'>
                <div className="flex flex-col items-start text-left">
                    <h1
                        className="
                            font-playfair
                            text-4xl md:text-[40px] font-bold
                            text-white
                            drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]
                        "
                    >
                        Hotel Rooms
                    </h1>
                    <p
                        className="
                            mt-3
                            text-sm md:text-base
                            text-gray-300
                            max-w-[42rem]
                            "
                    >
                        Take advantage of our limited-time offers and special packages to enhance
                        your stay and create unforgettable memories.
                    </p>
                </div>


                <div className='flex gap-3 flex-wrap mt-6'>
                    {filteredHotels.map((hotel) => (
                        <button key={hotel._id} onClick={() => { setSelectedHotelId(hotel._id); scrollTo(0, 0); }} className={`px-4 py-2 rounded border ${selectedHotelId === hotel._id ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700'} cursor-pointer`}>
                            {hotel.name} - {hotel.city}
                        </button>
                    ))}
                    {!filteredHotels.length && <p className='text-sm text-red-500'>No hotels found for this destination.</p>}
                </div>

                {loadingRooms && <p className='mt-6 text-gray-500'>Loading rooms...</p>}

                {filteredRooms.map((room) => (
                    <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                        <img title='View Room Details' onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }} src={room.images[0]} alt="hotel-img" className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />
                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <p className='text-gray-500'>{room.hotel.city}</p>
                            <p onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }} className='text-emerald-800 text-3xl font-playfair cursor-pointer' title='View Room Details'>{room.hotel.name}</p>
                            <div className='flex items-center'>
                                <StarRating />
                                <p className='ml-2'>200+ reviews</p>
                            </div>
                            <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                <img src={assets.locationIcon} alt="location-icon" />
                                <span>{room.hotel.address}</span>
                            </div>
                            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            <p className='text-xl font-medium text-gray-900'>${room.pricePerNight} /night</p>
                        </div>
                    </div>
                ))}

                {!loadingRooms && selectedHotelId && filteredRooms.length === 0 && (
                    <p className='mt-6 text-gray-500'>No rooms available for this hotel with the selected filters.</p>
                )}
            </div>

            <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
                <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
                    <p className='text-base font-medium text-red-7000'>FILTERS</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                            {openFilters ? "HIDE" : "SHOW"}
                        </span>
                        <span onClick={clearFilters} className='hidden lg:block'>CLEAR</span>
                    </div>
                </div>
                <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-red-700 pb-2'>Popular filters</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox key={index} label={room} selected={selectedFilters.roomType.includes(room)} onChange={(checked) => handleFilterChange(checked, room, 'roomType')} />
                        ))}
                    </div>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-red-700 pb-2'>Price Range</p>
                        {priceRanges.map((range, index) => (
                            <CheckBox key={index} label={`${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)} onChange={(checked) => handleFilterChange(checked, range, 'priceRange')} />
                        ))}</div>
                    <div className="px-5 pt-5 pb-7">
                        <p className="font-medium text-red-700 pb-2">Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton key={index} label={option} selected={selectedSort === option} onChange={() => handleSortChange(option)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllRooms;
