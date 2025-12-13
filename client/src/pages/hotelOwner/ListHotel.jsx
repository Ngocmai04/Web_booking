import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ListHotel = () => {

    const { axios, getToken, user, ownerHotels, fetchOwnerHotels } = useAppContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Delete Hotel
    const deleteHotel = async (hotelId) => {
        if (window.confirm('Are you sure you want to delete this hotel?')) {
            try {
                setLoading(true)
                const { data } = await axios.delete(`/api/hotels/${hotelId}`, { headers: { Authorization: `Bearer ${await getToken()}` } })
                if (data.success) {
                    toast.success(data.message)
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
            fetchOwnerHotels();
        }
    }, [user, ownerHotels, fetchOwnerHotels]);

    return (
        <div>
            <Title align='left' title='Manage Hotels' subTitle='View and manage all your registered hotels' />

            <div className='mt-8'>
                {ownerHotels.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-12'>
                        <p className='text-gray-500 text-lg mb-4'>No hotels registered yet</p>
                        <button 
                            onClick={() => navigate('/owner/add-hotel')}
                            className='bg-blue-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-700 transition'
                        >
                            Add Your First Hotel
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {ownerHotels.map((hotel) => (
                            <div key={hotel._id} className='bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition p-6'>
                                <h3 className='text-xl font-bold text-gray-800 mb-2'>{hotel.name}</h3>
                                <p className='text-sm text-gray-600 mb-1'><span className='font-medium'>Address:</span> {hotel.address}</p>
                                <p className='text-sm text-gray-600 mb-1'><span className='font-medium'>City:</span> {hotel.city}</p>
                                <p className='text-sm text-gray-600 mb-4'><span className='font-medium'>Contact:</span> {hotel.contact}</p>
                                
                                <div className='flex gap-3 pt-4 border-t border-gray-200'>
                                    <button 
                                        onClick={() => navigate(`/owner/edit-hotel/${hotel._id}`)}
                                        className='flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition'
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteHotel(hotel._id)}
                                        disabled={loading}
                                        className='flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {ownerHotels.length > 0 && (
                    <div className='mt-8'>
                        <button 
                            onClick={() => navigate('/owner/add-hotel')}
                            className='bg-blue-600 text-white px-8 py-3 rounded cursor-pointer hover:bg-blue-700 transition font-medium'
                        >
                            + Add New Hotel
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListHotel
