import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Snowflake, Gift, TreePine } from 'lucide-react'

const ListHotel = () => {
    const { axios, getToken, user, ownerHotels, fetchOwnerHotels } = useAppContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Delete Hotel
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
        <div className="relative min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-green-900 overflow-hidden">
            {/* Snow animation */}
            <div className="pointer-events-none absolute inset-0 bg-[url('/snow.png')] bg-repeat opacity-30 animate-[snow_20s_linear_infinite]" />

            <div className="relative z-10 px-4">
                <Title
                    align="left"
                    title="🎄 Manage Your Christmas Hotels"
                    subTitle="Feel the magic of Christmas while managing your hotels"
                />

                <div className="mt-10">
                    {ownerHotels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <TreePine className="w-20 h-20 text-green-300 mb-6" />
                            <p className="text-red-100 text-xl mb-6">
                                No hotels yet — let’s add some Christmas magic ✨
                            </p>
                            <button
                                onClick={() => navigate('/owner/add-hotel')}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-red-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
                            >
                                <Gift className="w-5 h-5" /> Add Your First Hotel
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ownerHotels.map((hotel) => (
                                <div
                                    key={hotel._id}
                                    className="relative bg-white/90 backdrop-blur border border-red-200 rounded-2xl shadow-xl hover:shadow-2xl transition p-6"
                                >
                                    <div className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full shadow">
                                        <Snowflake className="w-5 h-5" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-red-700 mb-2">
                                        {hotel.name}
                                    </h3>
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-semibold">Address:</span> {hotel.address}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-semibold">City:</span> {hotel.city}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-4">
                                        <span className="font-semibold">Contact:</span> {hotel.contact}
                                    </p>

                                    <div className="flex gap-3 pt-4 border-t border-dashed border-red-300">
                                        <button
                                            onClick={() => navigate(`/owner/edit-hotel/${hotel._id}`)}
                                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition"
                                        >
                                            🎅 Edit
                                        </button>
                                        <button
                                            onClick={() => deleteHotel(hotel._id)}
                                            disabled={loading}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
                                        >
                                            ❄ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {ownerHotels.length > 0 && (
                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => navigate('/owner/add-hotel')}
                                className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-green-600 text-white px-10 py-4 rounded-full shadow-xl hover:scale-105 transition font-semibold text-lg"
                            >
                                <Gift className="w-6 h-6" /> Add New Hotel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListHotel
