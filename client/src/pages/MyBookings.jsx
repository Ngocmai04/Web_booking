import React, { useCallback, useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
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

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />
            <div className="max-w-6xl mt-8 w-full text-emerald-800">
                <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
                    <div className="w-1/3">Hotels</div>
                    <div className="w-1/3">Date & Timings</div>
                    <div className="w-1/3">Payment</div>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>You don't have any bookings yet.</p>
                    </div>
                ) : bookings.map((booking) => (
                    <div key={booking._id} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t">
                        <div className="flex flex-col md:flex-row">
                            <img className="min-md:w-44 rounded shadow object-cover" src={booking.room?.images?.[0] || ''} alt="hotel-img" />
                            <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                                <p className="font-playfair text-2xl">
                                    {booking.hotel?.name || 'Hotel'}
                                    <span className="font-inter text-sm"> ({booking.room?.roomType || 'Room'})</span>
                                </p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <img src={assets.locationIcon} alt="location-icon" />
                                    <span>{booking.hotel?.address || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <img src={assets.guestsIcon} alt="guests-icon" />
                                    <span>Guests: {booking.guests}</span>
                                </div>
                                <p className="text-base">Total: ${booking.totalPrice}</p>
                            </div>
                        </div>

                        <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                            <div>
                                <p>Check-In:</p>
                                <p className="text-gray-500 text-sm">{new Date(booking.checkInDate).toDateString()}</p>
                            </div>
                            <div>
                                <p>Check-Out:</p>
                                <p className="text-gray-500 text-sm">{new Date(booking.checkOutDate).toDateString()}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-center pt-3">
                            {/* Trạng thái xác nhận email */}
                            {!booking.isEmailConfirmed && (
                                <div className="mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse"></div>
                                        <p className="text-sm text-yellow-600">Awaiting email confirmation</p>
                                    </div>
                                    <button 
                                        onClick={() => handleResendConfirmation(booking._id)} 
                                        disabled={resendingId === booking._id}
                                        className="px-3 py-1 mt-2 text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-full hover:bg-yellow-200 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {resendingId === booking._id ? 'Sending...' : 'Resend email'}
                                    </button>
                                </div>
                            )}

                            {/* Trạng thái thanh toán - chỉ hiện khi đã xác nhận email */}
                            {booking.isEmailConfirmed && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                                        <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                                            {booking.isPaid ? "Paid" : "Unpaid"}
                                        </p>
                                    </div>
                                    {!booking.isPaid && (
                                        <button onClick={() => handlePayment(booking._id)} className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
                                            Pay now
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Trạng thái booking */}
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {booking.status === 'confirmed' ? 'Confirmed' :
                                     booking.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings