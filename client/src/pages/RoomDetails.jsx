import React, { useEffect, useState } from 'react'
import { roomCommonData } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const RoomDetails = () => {
    const { id } = useParams();
    const { facilityIcons, rooms, getToken, axios, navigate } = useAppContext();

    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);

    const [isAvailable, setIsAvailable] = useState(false);

    // Check if the Room is Available
    const checkAvailability = async () => {
        try {
            if (checkInDate >= checkOutDate) {
                toast.error('Check-In Date should be less than Check-Out Date')
                return;
            }

            const { data } = await axios.post('/api/bookings/check-availability', { room: id, checkInDate, checkOutDate })
            if (data.success) {
                if (data.isAvailable) {
                    setIsAvailable(true)
                    toast.success('Room is available')
                } else {
                    setIsAvailable(false)
                    toast.error('Room is not available')
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // onSubmitHandler function to check availability & book the room
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (!isAvailable) {
                return checkAvailability();
            } else {
                const { data } = await axios.post('/api/bookings/book', { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay At Hotel" }, { headers: { Authorization: `Bearer ${await getToken()}` } })
                if (data.success) {
                    toast.success(data.message)
                    navigate('/my-bookings')
                    scrollTo(0, 0)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const room = rooms.find(room => room._id === id);
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    }, [rooms, id]);

    return room && (
        <div className='relative py-24 md:py-32 px-4 md:px-12 lg:px-20 xl:px-28 bg-gradient-to-b from-emerald-900 via-red-950 to-emerald-950 overflow-hidden'>

            {/* Magical Christmas Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Snowflakes */}
                {[...Array(50)].map((_, i) => (
                    <div
                        key={`snow-${i}`}
                        className="absolute text-white animate-snow-fall"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${10 + Math.random() * 15}s`,
                            animationDelay: `${Math.random() * 8}s`,
                            fontSize: `${8 + Math.random() * 12}px`,
                            opacity: 0.6 + Math.random() * 0.4,
                        }}
                    >
                        ❄
                    </div>
                ))}

                {/* Christmas Lights Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-green-500 via-yellow-400 via-red-500 to-green-500 opacity-70 animate-pulse"></div>
            </div>

            <style>{`
                @keyframes snow-fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                .animate-snow-fall {
                    animation: snow-fall linear infinite;
                }
                @keyframes shimmer {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                .animate-shimmer {
                    animation: shimmer 2s ease-in-out infinite;
                }
            `}</style>

            <div className='relative z-10 max-w-7xl mx-auto'>
                {/* Festive Header Card */}
                <div className="bg-gradient-to-br from-red-600/90 via-green-600/90 to-red-600/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-yellow-400/50 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl animate-shimmer">🎄</span>
                                <h1 className="text-3xl md:text-5xl font-playfair font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                                    {room.hotel.name}
                                </h1>
                            </div>
                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold text-sm border-2 border-white/40">
                                ✨ {room.roomType}
                            </span>

                            <div className='flex items-center gap-4 mt-4'>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <StarRating />
                                    <p className='text-white font-medium text-sm'>⭐ 200+ reviews</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2 mt-3 text-white/90'>
                                <span className="text-xl">📍</span>
                                <span className="text-sm">{room.hotel.address}</span>
                            </div>
                        </div>

                        {/* Christmas Sale Badge */}
                        {room.discount > 0 && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 px-8 py-6 rounded-2xl shadow-2xl border-4 border-red-600 transform hover:scale-105 transition-transform">
                                    <p className="text-red-700 font-black text-4xl text-center">
                                        🎅 {room.discount}%
                                    </p>
                                    <p className="text-red-800 font-bold text-lg text-center mt-1">OFF</p>
                                    <div className="absolute -top-2 -right-2 text-3xl animate-bounce">⭐</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Room Images Gallery */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                    <div className='relative group'>
                        <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent rounded-2xl z-10 pointer-events-none"></div>
                        <img className='w-full h-[400px] lg:h-[500px] rounded-2xl shadow-2xl object-cover border-4 border-yellow-400/60 transform group-hover:scale-[1.02] transition-transform duration-300'
                            src={mainImage} alt='Room Image' />
                        <div className="absolute top-4 right-4 z-20 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                            ✨ Featured
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        {room?.images.length > 1 && room.images.slice(0, 4).map((image, index) => (
                            <div key={index} className='relative group cursor-pointer' onClick={() => setMainImage(image)}>
                                <img
                                    className={`w-full h-[190px] lg:h-[240px] rounded-xl shadow-lg object-cover border-4 transition-all duration-300 group-hover:scale-105 ${mainImage === image
                                        ? 'border-yellow-400 shadow-yellow-400/50 shadow-2xl'
                                        : 'border-green-400/60 hover:border-red-400/60'
                                        }`}
                                    src={image} alt='Room Image' />
                                {mainImage === image && (
                                    <div className="absolute inset-0 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                                        <span className="text-4xl">✨</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Room Highlights & Price */}
                <div className='bg-gradient-to-br from-white via-red-50 to-green-50 p-8 rounded-3xl shadow-2xl border-4 border-red-200 mb-8'>
                    <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6'>
                        <div className='flex-1'>
                            <h2 className='text-3xl md:text-4xl font-playfair font-bold bg-gradient-to-r from-red-700 via-green-700 to-red-700 bg-clip-text text-transparent mb-6 flex items-center gap-3'>
                                🎅 Christmas Luxury Experience
                            </h2>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-100 to-green-100 shadow-md border-2 border-red-200 hover:shadow-xl hover:scale-105 transition-all cursor-pointer'>
                                        <img src={facilityIcons[item]} alt={item} className='w-6 h-6' />
                                        <p className='text-sm font-semibold text-gray-700'>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Festive Price Card */}
                        <div className='relative'>
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-green-500 blur-xl opacity-50"></div>
                            <div className='relative bg-gradient-to-br from-red-600 via-red-500 to-green-600 text-white px-8 py-6 rounded-2xl shadow-2xl border-4 border-yellow-400 min-w-[200px]'>
                                <div className="text-center">
                                    <p className='text-sm font-semibold opacity-90 mb-1'>🎁 Special Price</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <p className='text-5xl font-black'>${room.pricePerNight}</p>
                                    </div>
                                    <p className='text-sm opacity-90 mt-1'>/night</p>
                                </div>
                                <div className="absolute -top-3 -right-3 text-3xl animate-bounce">🌟</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form - Christmas Themed */}
                <form onSubmit={onSubmitHandler} className='bg-gradient-to-br from-white via-green-50 to-red-50 backdrop-blur-sm shadow-2xl p-8 rounded-3xl border-4 border-green-300 mb-10'>
                    <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                        <span className="text-3xl">🎄</span>
                        Book Your Christmas Stay
                        <span className="text-3xl">🎄</span>
                    </h3>

                    <div className='flex flex-col lg:flex-row items-stretch gap-6'>
                        <div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='flex flex-col'>
                                <label htmlFor='checkInDate' className='font-bold text-red-700 flex items-center gap-2 mb-2 text-lg'>
                                    🎄 Check-In
                                </label>
                                <input
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                    id='checkInDate'
                                    type='date'
                                    min={new Date().toISOString().split('T')[0]}
                                    className='w-full rounded-xl border-3 border-red-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all shadow-md hover:shadow-lg bg-white text-gray-900'
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor='checkOutDate' className='font-bold text-green-700 flex items-center gap-2 mb-2 text-lg'>
                                    🎁 Check-Out
                                </label>
                                <input
                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                    id='checkOutDate'
                                    type='date'
                                    min={checkInDate}
                                    disabled={!checkInDate}
                                    className='w-full rounded-xl border-3 border-green-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all shadow-md hover:shadow-lg bg-white disabled:opacity-50 text-gray-900'
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor='guests' className='font-bold text-red-700 flex items-center gap-2 mb-2 text-lg'>
                                    👥 Guests
                                </label>
                                <input
                                    onChange={(e) => setGuests(e.target.value)}
                                    value={guests}
                                    id='guests'
                                    type='number'
                                    min="1"
                                    className='w-full rounded-xl border-3 border-red-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 transition-all shadow-md hover:shadow-lg bg-white text-gray-900'
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='lg:w-64 bg-gradient-to-r from-red-600 via-green-600 to-red-600 hover:from-red-700 hover:via-green-700 hover:to-red-700 active:scale-95 transition-all text-white font-black rounded-2xl px-8 py-4 text-lg cursor-pointer shadow-2xl hover:shadow-red-500/50 border-4 border-yellow-400 relative overflow-hidden group'>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isAvailable ? "🎅 Book Now" : "🎄 Check Availability"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </form>

                {/* Room Specifications */}
                <div className='bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-green-200 mb-8'>
                    <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent flex items-center gap-2">
                        ✨ Room Features
                    </h3>
                    <div className="space-y-3">
                        {roomCommonData.map((spec, index) => (
                            <div key={index} className='flex items-start gap-4 p-5 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 transition-all border-2 border-transparent hover:border-red-200 hover:shadow-lg cursor-pointer group'>
                                <img className='w-8 h-8 group-hover:scale-110 transition-transform' src={spec.icon} alt={`${spec.title}-icon`} />
                                <div className="flex-1">
                                    <p className='text-lg font-bold text-gray-800 mb-1'>{spec.title}</p>
                                    <p className='text-gray-600 text-sm leading-relaxed'>{spec.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description Card */}
                <div className='bg-gradient-to-br from-red-50 via-white to-green-50 border-4 border-red-200 p-8 rounded-3xl shadow-xl mb-8'>
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                        🏠 About This Property
                    </h3>
                    <p className='text-gray-700 leading-relaxed text-lg'>
                        Guests will be allocated on the ground floor according to availability. You get a comfortable two bedroom apartment that has a true city feeling. The price quoted is for two guests; at the guest slot, please mark the number of guests to get the exact price for groups. The guests will be allocated ground floor according to availability. Experience comfort and luxury in this beautifully appointed space.
                    </p>
                </div>

                {/* Host Information Card */}
                <div className='bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl border-4 border-green-300'>
                    <div className='flex flex-col md:flex-row md:items-center gap-6'>
                        <div className='relative'>
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-green-500 rounded-full blur-xl opacity-50"></div>
                            <img
                                className='relative h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-yellow-400 shadow-2xl object-cover'
                                src={room.hotel.owner.image}
                                alt='Host'
                            />
                        </div>
                        <div className='flex-1'>
                            <p className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-2'>
                                Hosted by {room.hotel.name}
                            </p>
                            <div className='flex items-center gap-3'>
                                <StarRating />
                                <p className='text-gray-700 font-medium'>⭐ 200+ reviews</p>
                            </div>
                            <button className='mt-4 px-8 py-3 rounded-xl text-white bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 transition-all cursor-pointer shadow-lg hover:shadow-xl font-bold text-lg border-2 border-yellow-400 hover:scale-105 active:scale-95'>
                                📞 Contact Host
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomDetails