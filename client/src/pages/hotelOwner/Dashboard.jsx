import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {

    const { currency, user, getToken, toast, axios, ownerHotels, fetchOwnerHotels } = useAppContext();

    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        completedBookings: 0,
    });
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

    const fetchDashboardData = useCallback(async () => {
        try {
            const params = selectedHotelId ? { hotelId: selectedHotelId } : {}
            const { data } = await axios.get('/api/bookings/hotel', { params, headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                const bookings = data.dashboardData.bookings || [];
                const pendingCount = bookings.filter(b => !b.isPaid).length;
                const completedCount = bookings.filter(b => b.isPaid).length;
                
                setDashboardData({
                    ...data.dashboardData,
                    pendingBookings: pendingCount,
                    completedBookings: completedCount,
                })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [selectedHotelId, axios, getToken, toast]);

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
    }, [user, selectedHotelId, ownerHotels, fetchDashboardData]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const calculateNights = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return nights;
    };

    // SVG Icons
    const ChristmasTreeIcon = () => (
        <svg className="inline-block w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L9 8h6l-3-6z" fill="#228B22" stroke="#006400" strokeWidth="1"/>
            <path d="M8 8L5 14h14l-3-6H8z" fill="#228B22" stroke="#006400" strokeWidth="1"/>
            <path d="M6 14L3 20h18l-3-6H6z" fill="#228B22" stroke="#006400" strokeWidth="1"/>
            <rect x="10.5" y="20" width="3" height="2" fill="#8B4513"/>
            <circle cx="12" cy="5" r="0.8" fill="#FFD700"/>
            <circle cx="7" cy="11" r="0.8" fill="#FF0000"/>
            <circle cx="17" cy="11" r="0.8" fill="#FF0000"/>
            <circle cx="9" cy="17" r="0.8" fill="#FFD700"/>
            <circle cx="15" cy="17" r="0.8" fill="#FFD700"/>
        </svg>
    );

    const GiftIcon = () => (
        <svg className="inline-block w-6 h-6" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="10" width="16" height="10" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1.5"/>
            <path d="M12 10v10" stroke="#C92A2A" strokeWidth="1.5"/>
            <rect x="3" y="8" width="18" height="3" fill="#FFD700" stroke="#F59F00" strokeWidth="1.5"/>
            <path d="M12 3C10.5 3 9.5 4 9.5 5.5C9.5 6 10 7 11 8h2c1-1 1.5-2 1.5-2.5C14.5 4 13.5 3 12 3z" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1"/>
        </svg>
    );

    const SantaIcon = () => (
        <svg className="inline-block w-7 h-7" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="10" r="4" fill="#FFD4B8"/>
            <ellipse cx="12" cy="15" rx="6" ry="5" fill="#E03131"/>
            <rect x="10" y="3" width="4" height="4" rx="1" fill="#E03131"/>
            <rect x="9" y="6" width="6" height="2" rx="1" fill="#FFF"/>
            <circle cx="10" cy="9" r="0.8" fill="#000"/>
            <circle cx="14" cy="9" r="0.8" fill="#000"/>
            <path d="M12 11c-1 0-1.5 0.5-1.5 1h3c0-0.5-0.5-1-1.5-1z" fill="#E03131"/>
        </svg>
    );

    const BookingIcon = () => (
        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    );

    const RevenueIcon = () => (
        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const PendingIcon = () => (
        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const CompletedIcon = () => (
        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 mb-2 flex items-center gap-2">
                    <ChristmasTreeIcon /> Dashboard
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
                            {selectedHotelId === hotel._id && <GiftIcon />} {hotel.name} - {hotel.city}
                        </span>
                        {selectedHotelId === hotel._id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-transparent animate-pulse"></div>
                        )}
                    </button>
                ))}
                {!ownerHotels.length && (
                    <div className="bg-red-100 border-3 border-red-400 rounded-2xl px-6 py-4 shadow-lg">
                        <p className='text-sm text-red-700 font-bold flex items-center gap-2'>
                            <SantaIcon /> Please register a hotel to view dashboard insights.
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group'>
                    <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                        <GiftIcon />
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className="bg-blue-500 p-4 rounded-2xl shadow-lg">
                            <BookingIcon />
                        </div>
                        <div className='flex flex-col font-medium'>
                            <p className='text-blue-700 text-lg font-bold'>Total Bookings</p>
                            <p className='text-blue-900 text-4xl font-black mt-2'>{dashboardData.totalBookings}</p>
                        </div>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group'>
                    <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover:opacity-40 transition-opacity scale-150">
                        <RevenueIcon />
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className="bg-green-500 p-4 rounded-2xl shadow-lg">
                            <RevenueIcon />
                        </div>
                        <div className='flex flex-col font-medium'>
                            <p className='text-green-700 text-lg font-bold'>Total Revenue</p>
                            <p className='text-green-900 text-3xl font-black mt-2'>{currency} {dashboardData.totalRevenue}</p>
                        </div>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-yellow-50 to-yellow-100 border-4 border-yellow-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group'>
                    <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                        <PendingIcon />
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className="bg-yellow-500 p-4 rounded-2xl shadow-lg">
                            <PendingIcon />
                        </div>
                        <div className='flex flex-col font-medium'>
                            <p className='text-yellow-700 text-lg font-bold'>Pending</p>
                            <p className='text-yellow-900 text-4xl font-black mt-2'>{dashboardData.pendingBookings}</p>
                        </div>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-emerald-50 to-emerald-100 border-4 border-emerald-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group'>
                    <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                        <CompletedIcon />
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg">
                            <CompletedIcon />
                        </div>
                        <div className='flex flex-col font-medium'>
                            <p className='text-emerald-700 text-lg font-bold'>Completed</p>
                            <p className='text-emerald-900 text-4xl font-black mt-2'>{dashboardData.completedBookings}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className='text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 flex items-center gap-2'>
                    <ChristmasTreeIcon /> Recent Bookings
                </h2>
                <div className="flex gap-2 bg-white border-3 border-red-300 rounded-full p-1 shadow-lg">
                    <button
                        onClick={() => setViewMode('card')}
                        className={`p-3 rounded-full transition-all ${
                            viewMode === 'card'
                                ? 'bg-gradient-to-r from-red-500 to-green-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Card View"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-3 rounded-full transition-all ${
                            viewMode === 'table'
                                ? 'bg-gradient-to-r from-red-500 to-green-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Table View"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Recent Bookings - Card View */}
            {viewMode === 'card' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dashboardData.bookings.length === 0 ? (
                        <div className="col-span-2 bg-gradient-to-br from-red-50 to-green-50 border-4 border-red-300 rounded-3xl p-12 text-center shadow-xl">
                            <div className="text-6xl mb-4 flex justify-center">
                                <SantaIcon />
                            </div>
                            <p className="text-gray-500 text-lg">No bookings yet!</p>
                        </div>
                    ) : (
                        dashboardData.bookings.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white border-4 border-green-300 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-800">{item.user.username}</h3>
                                        <p className="text-sm text-gray-600">{item.user.email}</p>
                                    </div>
                                    <span className={`inline-flex items-center py-2 px-4 text-xs font-bold rounded-full ${
                                        item.isPaid 
                                            ? "bg-green-200 text-green-700 border-2 border-green-400" 
                                            : "bg-yellow-200 text-yellow-700 border-2 border-yellow-400"
                                    }`}>
                                        {item.isPaid ? (
                                            <>
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Pending
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-2xl p-4 mb-4">
                                    <p className="text-lg font-bold text-gray-800 mb-1">{item.room.roomType}</p>
                                    <p className="text-sm text-gray-600">Room #{item.room.roomNumber || 'N/A'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                                        <p className="text-xs text-blue-600 font-bold mb-1">CHECK-IN</p>
                                        <p className="text-sm font-black text-blue-800">{formatDate(item.checkInDate)}</p>
                                    </div>
                                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                                        <p className="text-xs text-red-600 font-bold mb-1">CHECK-OUT</p>
                                        <p className="text-sm font-black text-red-800">{formatDate(item.checkOutDate)}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold">Duration</p>
                                        <p className="text-lg font-black text-gray-800">
                                            {calculateNights(item.checkInDate, item.checkOutDate)} Night{calculateNights(item.checkInDate, item.checkOutDate) > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 font-bold">Total Amount</p>
                                        <p className="text-2xl font-black text-green-600">{currency} {item.totalPrice}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Recent Bookings - Table View */}
            {viewMode === 'table' && (
                <div className="bg-gradient-to-br from-red-50 to-green-50 border-4 border-red-300 rounded-3xl p-6 shadow-xl">
                    <div className='w-full bg-white rounded-2xl border-3 border-green-300 shadow-lg overflow-hidden'>
                        <div className="overflow-x-auto">
                            <table className='w-full'>
                                <thead className='bg-gradient-to-r from-red-500 to-green-500 text-white'>
                                    <tr>
                                        <th className='py-4 px-4 font-bold text-left text-sm'>Guest</th>
                                        <th className='py-4 px-4 font-bold text-left text-sm'>Room</th>
                                        <th className='py-4 px-4 font-bold text-center text-sm'>Check-In</th>
                                        <th className='py-4 px-4 font-bold text-center text-sm'>Check-Out</th>
                                        <th className='py-4 px-4 font-bold text-center text-sm'>Nights</th>
                                        <th className='py-4 px-4 font-bold text-center text-sm'>Amount</th>
                                        <th className='py-4 px-4 font-bold text-center text-sm'>Status</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm'>
                                    {dashboardData.bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center">
                                                <div className="text-6xl mb-4 flex justify-center">
                                                    <SantaIcon />
                                                </div>
                                                <p className="text-gray-500 text-lg">No bookings yet!</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        dashboardData.bookings.map((item, index) => (
                                            <tr key={index} className="hover:bg-red-50 transition-colors border-b border-gray-200">
                                                <td className='py-4 px-4'>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{item.user.username}</p>
                                                        <p className="text-xs text-gray-500">{item.user.email}</p>
                                                    </div>
                                                </td>
                                                <td className='py-4 px-4'>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{item.room.roomType}</p>
                                                        <p className="text-xs text-gray-500">Room #{item.room.roomNumber || 'N/A'}</p>
                                                    </div>
                                                </td>
                                                <td className='py-4 px-4 text-center'>
                                                    <span className="inline-block bg-blue-100 text-blue-800 font-bold py-1 px-3 rounded-lg text-xs">
                                                        {formatDate(item.checkInDate)}
                                                    </span>
                                                </td>
                                                <td className='py-4 px-4 text-center'>
                                                    <span className="inline-block bg-red-100 text-red-800 font-bold py-1 px-3 rounded-lg text-xs">
                                                        {formatDate(item.checkOutDate)}
                                                    </span>
                                                </td>
                                                <td className='py-4 px-4 text-center font-bold text-gray-800'>
                                                    {calculateNights(item.checkInDate, item.checkOutDate)}
                                                </td>
                                                <td className='py-4 px-4 text-center font-black text-green-600'>
                                                    {currency} {item.totalPrice}
                                                </td>
                                                <td className='py-4 px-4 text-center'>
                                                    <span className={`inline-flex items-center py-2 px-3 text-xs font-bold rounded-full ${
                                                        item.isPaid 
                                                            ? "bg-green-200 text-green-700 border-2 border-green-400" 
                                                            : "bg-yellow-200 text-yellow-700 border-2 border-yellow-400"
                                                    }`}>
                                                        {item.isPaid ? (
                                                            <>
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Paid
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Pending
                                                            </>
                                                        )}
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
            )}
        </div>
    )
}

export default Dashboard