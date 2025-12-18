import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { 
    FaHotel, 
    FaTree, 
    FaGift, 
    FaWandMagicSparkles, 
    FaMapLocationDot, 
    FaCity, 
    FaPhoneVolume, 
    FaPenToSquare, 
    FaTrash, 
    FaPlus, 
    FaStar 
} from "react-icons/fa6";

const ListHotel = () => {
    const { axios, getToken, user, ownerHotels, fetchOwnerHotels } = useAppContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const deleteHotel = async (hotelId) => {
        if (window.confirm('🎄 Are you sure you want to delete this hotel?')) {
            try {
                setLoading(true)
                const { data } = await axios.delete(`/api/hotels/${hotelId}`, {
                    headers: { Authorization: `Bearer ${await getToken()}` },
                })
                if (data.success) {
                    toast.success(`🎁 ${data.message}`)
                    fetchOwnerHotels()
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (user && !ownerHotels.length) {
            fetchOwnerHotels()
        }
    }, [user, ownerHotels, fetchOwnerHotels])

    return (
        <div>
            {/* Header */}
    <div className="mb-10 relative">
        <div className="absolute -top-3 -left-4.5 text-6xl opacity-20 animate-bounce text-red-600">
            🏨
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 mb-3 drop-shadow-lg flex items-center gap-3">
            <FaHotel className="text-red-600" /> Manage Your Hotels
        </h1>
        <p className="text-gray-700 font-semibold text-lg leading-relaxed">
            Feel the magic of Christmas while managing your hotels. View, edit, or remove your hotel listings.
        </p>
    </div>

    {ownerHotels.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 relative">
            {/* Decorative elements */}
            <div className="absolute top-10 left-1/4 text-6xl opacity-20 animate-bounce text-green-600">
                <FaTree />
            </div>
            <div className="absolute bottom-10 right-1/4 text-6xl opacity-20 animate-bounce text-red-600" style={{animationDelay: '0.5s'}}>
                <FaGift />
            </div>
            
            <div className="bg-gradient-to-br from-red-100 via-green-100 to-red-100 border-4 border-red-400 rounded-3xl p-12 shadow-2xl text-center max-w-2xl">
                <div className="text-9xl mb-6 animate-bounce text-red-600 mx-auto flex justify-center">
                    <FaHotel />
                </div>
                <h2 className="text-4xl font-black text-red-700 mb-4 drop-shadow-lg">
                    No Hotels Yet
                </h2>
                <p className="text-xl text-gray-700 mb-8 font-semibold flex items-center justify-center gap-2">
                    Let's add some Christmas magic and create your first hotel! <FaWandMagicSparkles className="text-yellow-500"/>
                </p>
                <button
                    onClick={() => navigate('/owner/add-hotel')}
                    className="bg-gradient-to-r from-green-600 via-red-600 to-green-600 text-white px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all font-black text-xl border-4 border-yellow-400 relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        <span className="text-2xl"><FaGift /></span>
                        Add Your First Hotel
                        <span className="text-2xl"><FaGift /></span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </div>
        </div>
    ) : (
        <>
            {/* Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {ownerHotels.map((hotel, index) => (
                    <div
                        key={hotel._id}
                        className="relative bg-gradient-to-br from-white via-red-50 to-green-50 backdrop-blur border-4 border-red-300 rounded-3xl shadow-2xl hover:shadow-3xl transition-all p-8 group hover:scale-105 duration-300"
                        style={{animationDelay: `${index * 0.1}s`}}
                    >
                        {/* Corner Decorations */}
                        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-green-500 text-white p-3 rounded-full shadow-xl group-hover:rotate-12 transition-transform">
                            <span className="text-xl"><FaHotel /></span>
                        </div>
                        <div className="absolute -bottom-2 -left-2 bg-yellow-400 text-red-700 px-3 py-1 rounded-full shadow-lg font-black text-xs">
                            Hotel #{index + 1}
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 mb-4 drop-shadow-lg truncate">
                                {hotel.name}
                            </h3>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-3">
                                    <span className="text-xl text-red-500 mt-1"><FaMapLocationDot /></span>
                                    <div>
                                        <p className="font-bold text-gray-600 text-xs uppercase tracking-wider">Address</p>
                                        <p className="text-gray-800 font-semibold line-clamp-2">{hotel.address}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <span className="text-xl text-green-500 mt-1"><FaCity /></span>
                                    <div>
                                        <p className="font-bold text-gray-600 text-xs uppercase tracking-wider">City</p>
                                        <p className="text-gray-800 font-semibold">{hotel.city}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <span className="text-xl text-yellow-500 mt-1"><FaPhoneVolume /></span>
                                    <div>
                                        <p className="font-bold text-gray-600 text-xs uppercase tracking-wider">Contact</p>
                                        <p className="text-gray-800 font-semibold">{hotel.contact}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6 border-t-2 border-dashed border-red-300">
                                <button
                                    onClick={() => navigate(`/owner/edit-hotel/${hotel._id}`)}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl text-sm font-black hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 border-2 border-green-700"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <FaPenToSquare /> Edit
                                    </span>
                                </button>
                                <button
                                    onClick={() => deleteHotel(hotel._id)}
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl text-sm font-black hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-red-700"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <FaTrash /> Delete
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-green-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                    </div>
                ))}
            </div>

            {/* Add New Hotel Button */}
            <div className="flex justify-center pt-8">
                <button
                    onClick={() => navigate('/owner/add-hotel')}
                    className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white px-12 py-5 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all font-black text-xl border-4 border-yellow-400 relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        <span className="text-2xl"><FaPlus /></span>
                        Add New Hotel
                        <span className="text-2xl"><FaHotel /></span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Animated decorations */}
                    <div className="absolute top-2 left-8 text-yellow-300 animate-ping opacity-0 group-hover:opacity-100">
                        <FaStar />
                    </div>
                    <div className="absolute bottom-2 right-8 text-yellow-300 animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '0.2s'}}>
                        <FaStar />
                    </div>
                </button>
            </div>
        </>
    )}
        </div>
    )
}

export default ListHotel