import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {

    const { currency, user, getToken, toast, axios, ownerHotels, fetchOwnerHotels } = useAppContext();

    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
    });
    const [selectedHotelId, setSelectedHotelId] = useState('');

    const fetchDashboardData = async () => {
        try {
            const params = selectedHotelId ? { hotelId: selectedHotelId } : {}
            const { data } = await axios.get('/api/bookings/hotel', { params, headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user && !ownerHotels.length) {
            fetchOwnerHotels();
        }
    }, [user, ownerHotels, fetchOwnerHotels]);

    useEffect(() => {
        if (ownerHotels.length && !selectedHotelId) {
            setSelectedHotelId(ownerHotels[0]._id)
        }
    }, [ownerHotels, selectedHotelId]);

    useEffect(() => {
        if (user && (ownerHotels.length || selectedHotelId)) {
            fetchDashboardData();
        }
    }, [user, selectedHotelId, ownerHotels]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 mb-2">
                    🎄 Dashboard
                </h1>
                <p className="text-gray-700 leading-relaxed">
                    Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations.
                </p>
            </div>

            {/* Hotel Selection */}
            <div className='flex gap-3 flex-wrap mt-6 mb-8'>
                {ownerHotels.map((hotel) => (
                    <button 
                        key={hotel._id} 
                        onClick={() => setSelectedHotelId(hotel._id)} 
                        className={`
                            px-6 py-3 rounded-full font-bold text-sm
                            transition-all duration-300 transform
                            border-3 shadow-lg
                            ${selectedHotelId === hotel._id 
                                ? 'bg-gradient-to-r from-red-600 to-green-600 text-white border-yellow-400 scale-110 shadow-xl' 
                                : 'bg-white text-gray-700 border-red-300 hover:scale-105 hover:border-green-400 hover:shadow-xl'
                            }
                            cursor-pointer relative overflow-hidden group
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {selectedHotelId === hotel._id && '🎁'} {hotel.name} - {hotel.city}
                        </span>
                        {selectedHotelId === hotel._id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-transparent animate-pulse"></div>
                        )}
                    </button>
                ))}
                {!ownerHotels.length && (
                    <div className="bg-red-100 border-3 border-red-400 rounded-2xl px-6 py-4 shadow-lg">
                        <p className='text-sm text-red-700 font-bold flex items-center gap-2'>
                            🎅 Please register a hotel to view dashboard insights.
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group'>
                    <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                        🎁
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className="bg-blue-500 p-4 rounded-2xl shadow-lg">
                            <img className='h-12 w-12 filter brightness-0 invert' src={assets.totalBookingIcon} alt="" />
                        </div>
                        <div className='flex flex-col font-medium'>
                            <p className='text-blue-700 text-2xl font-bold'>Total Bookings</p>
                            <p className='text-blue-900 text-4xl font-black mt-2'>{dashboardData.totalBookings}</p>
                        </div>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group'>
                    <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                        💰
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className="bg-green-500 p-4 rounded-2xl shadow-lg">
                            <img className='h-12 w-12 filter brightness-0 invert' src={assets.totalRevenueIcon} alt="" />
                        </div>
                        <div className='flex flex-col font-medium'>
                            <p className='text-green-700 text-2xl font-bold'>Total Revenue</p>
                            <p className='text-green-900 text-4xl font-black mt-2'>{currency} {dashboardData.totalRevenue}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-gradient-to-br from-red-50 to-green-50 border-4 border-red-300 rounded-3xl p-6 shadow-xl">
                <h2 className='text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 mb-6 flex items-center gap-2'>
                    🎄 Recent Bookings
                </h2>
                
                <div className='w-full bg-white rounded-2xl border-3 border-green-300 shadow-lg overflow-hidden'>
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className='w-full'>
                            <thead className='bg-gradient-to-r from-red-500 to-green-500 text-white sticky top-0'>
                                <tr>
                                    <th className='py-4 px-6 font-bold text-left'>👤 User Name</th>
                                    <th className='py-4 px-6 font-bold text-left max-sm:hidden'>🏠 Room Name</th>
                                    <th className='py-4 px-6 font-bold text-center'>💵 Total Amount</th>
                                    <th className='py-4 px-6 font-bold text-center'>📊 Payment Status</th>
                                </tr>
                            </thead>
                            <tbody className='text-sm'>
                                {dashboardData.bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-12 text-center">
                                            <div className="text-6xl mb-4">🎅</div>
                                            <p className="text-gray-500 text-lg">No bookings yet!</p>
                                        </td>
                                    </tr>
                                ) : (
                                    dashboardData.bookings.map((item, index) => (
                                        <tr key={index} className="hover:bg-red-50 transition-colors border-b border-gray-200">
                                            <td className='py-4 px-6 text-gray-800 font-semibold'>{item.user.username}</td>
                                            <td className='py-4 px-6 text-gray-600 max-sm:hidden'>{item.room.roomType}</td>
                                            <td className='py-4 px-6 text-gray-800 font-bold text-center'>{currency} {item.totalPrice}</td>
                                            <td className='py-4 px-6 text-center'>
                                                <span className={`inline-block py-2 px-4 text-xs font-bold rounded-full ${
                                                    item.isPaid 
                                                        ? "bg-green-200 text-green-700 border-2 border-green-400" 
                                                        : "bg-yellow-200 text-yellow-700 border-2 border-yellow-400"
                                                }`}>
                                                    {item.isPaid ? "✓ Completed" : "⏳ Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard