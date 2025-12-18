import React, { useEffect, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { 
    FaBed, 
    FaHotel, 
    FaTriangleExclamation, 
    FaListUl, 
    FaMoneyBillWave, 
    FaCalendarCheck, 
    FaCheck, 
    FaXmark,
    FaDollarSign
} from "react-icons/fa6";

const ListRoom = () => {
    const { axios, getToken, user, ownerHotels, fetchOwnerHotels } = useAppContext()
    const [rooms, setRooms] = React.useState([])
    const [selectedHotelId, setSelectedHotelId] = React.useState('')

    // Wrap fetchRooms with useCallback to prevent infinite re-renders
    const fetchRooms = useCallback(async () => {
        try {
            const params = selectedHotelId ? { hotelId: selectedHotelId } : {}
            const { data } = await axios.get('/api/rooms/owner', { 
                params, 
                headers: { Authorization: `Bearer ${await getToken()}` } 
            })
            if (data.success) {
                setRooms(data.rooms)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [selectedHotelId, axios, getToken]) // Add dependencies

    const toggleAvailability = async (roomId) => {
        const { data } = await axios.post(
            "/api/rooms/toggle-availability", 
            { roomId }, 
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        )
        if (data.success) {
            toast.success(`🎁 ${data.message}`)
            fetchRooms() // Now fetchRooms is stable
        } else {
            toast.error(data.message)
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
    }, [ownerHotels, selectedHotelId])

    useEffect(() => {
        if (user && (ownerHotels.length || selectedHotelId)) {
            fetchRooms()
        }
    }, [user, selectedHotelId, ownerHotels, fetchRooms]) // Now fetchRooms is included

    return (
        <div>
            {/* Header */}
        <div className="mb-8 relative">
            <div className="absolute -top-2 -left-2 text-6xl opacity-20 animate-bounce text-blue-600">
                <FaBed />
            </div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mb-3 drop-shadow-lg flex items-center gap-3">
                <FaBed className="text-blue-600" /> Room Listings
            </h1>
            <p className="text-gray-700 font-semibold text-lg leading-relaxed">
                View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.
            </p>
        </div>

        {/* Hotel Selection */}
        <div className="mb-6">
            <p className='text-gray-700 font-black text-xl mb-4 flex items-center gap-2'>
                <FaHotel className="text-blue-600"/> Select Hotel
            </p>
            <div className='flex gap-3 flex-wrap'>
                {ownerHotels.map((hotel) => (
                    <button 
                        key={hotel._id} 
                        onClick={() => setSelectedHotelId(hotel._id)} 
                        className={`
                            relative px-6 py-3 rounded-2xl font-black text-sm
                            transition-all duration-300 transform
                            border-4 shadow-lg
                            ${selectedHotelId === hotel._id 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-indigo-400 scale-110 shadow-2xl' 
                                : 'bg-white text-gray-700 border-blue-300 hover:scale-105 hover:border-purple-400 hover:shadow-xl'
                            }
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {selectedHotelId === hotel._id && <FaHotel />} {hotel.name} - {hotel.city}
                        </span>
                        {selectedHotelId === hotel._id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 to-transparent animate-pulse"></div>
                        )}
                    </button>
                ))}
                {!ownerHotels.length && (
                    <div className="bg-gradient-to-r from-red-100 to-orange-100 border-4 border-red-400 rounded-2xl px-6 py-4 shadow-lg">
                        <p className='text-sm text-red-800 font-black flex items-center gap-2'>
                            <FaTriangleExclamation className="text-lg" /> Please register a hotel to manage rooms!
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* Rooms Table */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-4 border-blue-400 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-blue-300 rounded-br-full opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-300 rounded-tl-full opacity-30"></div>
            
            <h2 className='text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 flex items-center gap-3'>
                <FaBed className="text-blue-600" /> Available Rooms
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full shadow-md">
                    {rooms.length}
                </span>
            </h2>

            <div className='w-full bg-white rounded-2xl border-4 border-purple-400 shadow-xl overflow-hidden'>
                <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                    <table className='w-full'>
                        <thead className='bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white sticky top-0 z-10'>
                            <tr>
                                <th className='py-4 px-6 font-black text-left text-lg flex items-center gap-2'>
                                    <FaBed /> Room Type
                                </th>
                                <th className='py-4 px-6 font-black text-left text-lg max-sm:hidden'>
                                    <div className="flex items-center gap-2"><FaListUl /> Amenities</div>
                                </th>
                                <th className='py-4 px-6 font-black text-center text-lg'>
                                    <div className="flex items-center justify-center gap-2"><FaMoneyBillWave /> Price/Night</div>
                                </th>
                                <th className='py-4 px-6 font-black text-center text-lg'>
                                    <div className="flex items-center justify-center gap-2"><FaCalendarCheck /> Availability</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-sm'>
                            {rooms.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="text-8xl animate-bounce text-gray-300">
                                                <FaBed />
                                            </div>
                                            <p className="text-gray-500 text-xl font-bold">No rooms available!</p>
                                            <p className="text-gray-400 text-sm">Add your first room to start booking</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                rooms.map((item, index) => (
                                    <tr 
                                        key={index} 
                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all border-b-2 border-gray-100 group"
                                    >
                                        <td className='py-4 px-6 text-gray-800 font-bold text-base'>
                                            <span className="flex items-center gap-3">
                                                <FaBed className="text-xl text-blue-500" />
                                                {item.roomType}
                                            </span>
                                        </td>
                                        <td className='py-4 px-6 text-gray-600 font-semibold max-sm:hidden'>
                                            <div className="flex flex-wrap gap-2">
                                                {item.amenities.map((amenity, i) => (
                                                    <span 
                                                        key={i}
                                                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border-2 border-blue-300 shadow-sm"
                                                    >
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className='py-4 px-6 text-gray-900 font-black text-center text-lg'>
                                            <span className="flex items-center justify-center gap-1 text-green-600">
                                                <FaDollarSign /> {item.pricePerNight}
                                            </span>
                                        </td>
                                        <td className='py-4 px-6 text-center'>
                                            <label className="relative inline-flex items-center cursor-pointer group/toggle justify-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    onChange={() => toggleAvailability(item._id)} 
                                                    checked={item.isAvailable} 
                                                />
                                                <div className={`w-16 h-8 rounded-full transition-all duration-300 shadow-lg ${
                                                    item.isAvailable 
                                                        ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                                        : 'bg-gradient-to-r from-gray-300 to-gray-400'
                                                }`}>
                                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                                                        item.isAvailable ? 'translate-x-8' : 'translate-x-0'
                                                    }`}>
                                                        <span className={`text-xs ${item.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                                                            {item.isAvailable ? <FaCheck /> : <FaXmark />}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`ml-3 font-bold text-sm ${
                                                    item.isAvailable ? 'text-green-700' : 'text-gray-500'
                                                }`}>
                                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                                </span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #7c3aed);
                }
            `}</style>
        </div>
    )
}

export default ListRoom