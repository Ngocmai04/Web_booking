import React, { useCallback, useEffect, useState } from 'react'
import Title from '../components/Title' 
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
    const { axios, getToken, user } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [resendingId, setResendingId] = useState(null);

    const fetchUserBookings = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/bookings/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setBookings(data.bookings)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [axios, getToken])

    const handlePayment = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                window.location.href = data.url
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleResendConfirmation = async (bookingId) => {
        try {
            setResendingId(bookingId);
            const { data } = await axios.post('/api/bookings/resend-confirmation', { bookingId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setResendingId(null);
        }
    }

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user, fetchUserBookings]);

    // Snowflake component
    const Snowflakes = () => {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="snowflake-svg absolute opacity-70"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`,
                            width: `${10 + Math.random() * 10}px`,
                            height: `${10 + Math.random() * 10}px`
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="white">
                            <path d="M12,2L10,6.5L6,4L7,8L3,8L6.5,10L4,12L6.5,14L3,16L7,16L6,20L10,17.5L12,22L14,17.5L18,20L17,16L21,16L17.5,14L20,12L17.5,10L21,8L17,8L18,4L14,6.5L12,2Z"/>
                        </svg>
                    </div>
                ))}
                <style>{`
                    @keyframes fall {
                        0% { transform: translateY(-10vh) rotate(0deg); }
                        100% { transform: translateY(110vh) rotate(360deg); }
                    }
                    .snowflake-svg {
                        animation: fall linear infinite;
                    }
                `}</style>
            </div>
        )
    }

    // Christmas Tree SVG
    const ChristmasTree = () => (
        <svg className="w-12 h-12 animate-bounce" style={{animationDuration: '3s'}} viewBox="0 0 24 24" fill="none">
            <path d="M12 2L8 8H10L7 13H9L6 18H18L15 13H17L14 8H16L12 2Z" fill="#10B981"/>
            <rect x="10" y="18" width="4" height="4" fill="#92400E"/>
            <circle cx="12" cy="6" r="1" fill="#EF4444"/>
            <circle cx="10" cy="10" r="1" fill="#EAB308"/>
            <circle cx="14" cy="11" r="1" fill="#3B82F6"/>
        </svg>
    )

    // Santa SVG
    const Santa = () => (
        <svg className="w-12 h-12 animate-bounce" style={{animationDuration: '2.5s'}} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#EF4444"/>
            <circle cx="12" cy="10" r="6" fill="#FED7D7"/>
            <circle cx="10" cy="9" r="1" fill="#1F2937"/>
            <circle cx="14" cy="9" r="1" fill="#1F2937"/>
            <path d="M12 3C12 3 8 3 8 6H16C16 3 12 3 12 3Z" fill="white"/>
        </svg>
    )

    // Star SVG
    const Star = () => (
        <svg className="w-8 h-8 animate-pulse" viewBox="0 0 24 24" fill="#FBBF24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
    )

    return (
        <div className='relative min-h-screen py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-b from-red-50 via-green-50 to-white overflow-hidden'>
            {/* Font Awesome CSS */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            
            {/* Snowflakes */}
            <Snowflakes />
            
            {/* Christmas decorations */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-red-600 to-transparent opacity-20 pointer-events-none"></div>
            <div className="absolute top-4 left-8"><ChristmasTree /></div>
            <div className="absolute top-4 right-8"><Santa /></div>
            <div className="absolute top-20 left-1/4"><Star /></div>
            <div className="absolute top-16 right-1/4"><Star /></div>

            {/* Content */}
            <div className="relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent mb-2">
                        <i className="fas fa-tree text-green-600"></i> My Christmas Bookings <i className="fas fa-gift text-red-600"></i>
                    </h1>
                    <p className="text-gray-600 mt-3">
                        <i className="fas fa-snowflake text-blue-400"></i> Manage your festive holiday reservations
                    </p>
                </div>

                <div className="max-w-6xl mx-auto mt-8 w-full">
                    {/* Header */}
                    <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-2 border-red-200 bg-gradient-to-r from-red-100 to-green-100 rounded-t-2xl font-semibold text-base py-4 px-6 shadow-lg">
                        <div className="text-red-700">
                            <i className="fas fa-hotel mr-2"></i>Hotels
                        </div>
                        <div className="text-green-700">
                            <i className="fas fa-calendar-alt mr-2"></i>Date & Timings
                        </div>
                        <div className="text-red-700">
                            <i className="fas fa-credit-card mr-2"></i>Payment
                        </div>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="text-center py-16 bg-white/80 backdrop-blur rounded-2xl shadow-xl border-2 border-dashed border-red-300">
                            <i className="fas fa-gift text-8xl text-red-400 mb-4"></i>
                            <p className="text-gray-600 text-xl">No bookings yet this Christmas!</p>
                            <p className="text-gray-500 mt-2">
                                <i className="fas fa-snowman mr-2"></i>Start planning your holiday getaway
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((booking, index) => (
                                <div 
                                    key={booking._id} 
                                    className="group relative bg-white/90 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-red-200 hover:border-green-400 hover:scale-[1.02]"
                                    style={{animationDelay: `${index * 0.1}s`}}
                                >
                                    {/* Christmas lights decoration */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    {/* Sparkle effect on hover */}
                                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <i className="fas fa-sparkles text-yellow-400 text-3xl group-hover:animate-spin"></i>
                                    </div>
                                    <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <i className="fas fa-star text-yellow-400 text-3xl group-hover:animate-spin"></i>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] gap-6 p-6">
                                        {/* Hotel Info */}
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="relative group/img">
                                                <img 
                                                    className="w-full md:w-44 h-32 rounded-xl shadow-md object-cover transform group-hover/img:scale-105 transition-transform duration-300 border-4 border-red-100" 
                                                    src={booking.room?.images?.[0] || ''} 
                                                    alt="hotel-img" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="font-bold text-2xl text-red-700 group-hover:text-green-700 transition-colors">
                                                    <i className="fas fa-hotel mr-2"></i>
                                                    {booking.hotel?.name || 'Hotel'}
                                                </p>
                                                <span className="text-sm text-gray-600 font-medium bg-green-100 px-3 py-1 rounded-full w-fit">
                                                    <i className="fas fa-door-open mr-1"></i>
                                                    {booking.room?.roomType || 'Room'}
                                                </span>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <i className="fas fa-map-marker-alt text-red-500"></i>
                                                    <span>{booking.hotel?.address || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <i className="fas fa-users text-blue-500"></i>
                                                    <span>Guests: {booking.guests}</span>
                                                </div>
                                                <p className="text-xl font-bold text-green-700 mt-1">
                                                    <i className="fas fa-dollar-sign mr-1"></i>
                                                    {booking.totalPrice}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="flex flex-row md:flex-col justify-around md:justify-center gap-4">
                                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-xl hover:shadow-md transition-shadow">
                                                <p className="font-semibold text-red-700 flex items-center gap-2">
                                                    <i className="fas fa-plane-departure"></i>
                                                    Check-In
                                                </p>
                                                <p className="text-gray-700 text-sm mt-1 font-medium">
                                                    {new Date(booking.checkInDate).toDateString()}
                                                </p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl hover:shadow-md transition-shadow">
                                                <p className="font-semibold text-green-700 flex items-center gap-2">
                                                    <i className="fas fa-plane-arrival"></i>
                                                    Check-Out
                                                </p>
                                                <p className="text-gray-700 text-sm mt-1 font-medium">
                                                    {new Date(booking.checkOutDate).toDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment Status */}
                                        <div className="flex flex-col items-start justify-center gap-3">
                                            {/* Email Confirmation */}
                                            {!booking.isEmailConfirmed && (
                                                <div className="w-full bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 hover:shadow-md transition-all">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse"></div>
                                                        <p className="text-sm text-yellow-700 font-semibold">
                                                            <i className="fas fa-envelope mr-1"></i>
                                                            Awaiting confirmation
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleResendConfirmation(booking._id)} 
                                                        disabled={resendingId === booking._id}
                                                        className="w-full px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <i className={`fas ${resendingId === booking._id ? 'fa-spinner fa-spin' : 'fa-paper-plane'} mr-2`}></i>
                                                        {resendingId === booking._id ? 'Sending...' : 'Resend Email'}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Payment Status */}
                                            {booking.isEmailConfirmed && (
                                                <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-3 hover:shadow-md transition-all">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"}`}></div>
                                                        <p className={`text-sm font-bold ${booking.isPaid ? "text-green-700" : "text-red-700"}`}>
                                                            <i className={`fas ${booking.isPaid ? 'fa-check-circle' : 'fa-times-circle'} mr-1`}></i>
                                                            {booking.isPaid ? "Paid" : "Unpaid"}
                                                        </p>
                                                    </div>
                                                    {!booking.isPaid && (
                                                        <button 
                                                            onClick={() => handlePayment(booking._id)} 
                                                            className="w-full px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-green-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-green-600 transform hover:scale-105 transition-all shadow-lg"
                                                        >
                                                            <i className="fas fa-credit-card mr-2"></i>
                                                            Pay Now
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Booking Status */}
                                            <div className="w-full">
                                                <span className={`flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-bold rounded-lg shadow-md transition-all hover:scale-105 ${
                                                    booking.status === 'confirmed' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                                                    booking.status === 'cancelled' ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white' :
                                                    'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700'
                                                }`}>
                                                    <i className={`fas ${
                                                        booking.status === 'confirmed' ? 'fa-check-circle' :
                                                        booking.status === 'cancelled' ? 'fa-ban' : 'fa-clock'
                                                    }`}></i>
                                                    {booking.status === 'confirmed' ? 'Confirmed' :
                                                     booking.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer decoration */}
                <div className="text-center mt-12 space-x-4">
                    <i className="fas fa-gift text-4xl text-red-500 animate-pulse"></i>
                    <i className="fas fa-tree text-4xl text-green-500 animate-pulse"></i>
                    <i className="fas fa-snowman text-4xl text-blue-400 animate-pulse"></i>
                    <i className="fas fa-candy-cane text-4xl text-red-400 animate-pulse"></i>
                    <i className="fas fa-star text-4xl text-yellow-400 animate-pulse"></i>
                    <i className="fas fa-bell text-4xl text-yellow-600 animate-pulse"></i>
                    <i className="fas fa-snowflake text-4xl text-blue-300 animate-pulse"></i>
                </div>
            </div>
        </div>
    )
}

export default MyBookings