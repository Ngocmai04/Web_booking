import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const AddRoom = () => {

    const { axios, getToken, ownerHotels, fetchOwnerHotels } = useAppContext()

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [loading, setLoading] = useState(false);
    const [selectedHotelId, setSelectedHotelId] = useState('');

    const [inputs, setInputs] = useState({
        roomType: '',
        pricePerNight: 0,
        amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
        }
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image => image) || !selectedHotelId) {
            toast.error("Please fill in all the details")
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData()
            formData.append('roomType', inputs.roomType)
            formData.append('pricePerNight', inputs.pricePerNight)
            const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key])
            formData.append('amenities', JSON.stringify(amenities))
            formData.append('hotelId', selectedHotelId)

            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            const { data } = await axios.post('/api/rooms/', formData, { headers: { Authorization: `Bearer ${await getToken()}` } })

            if (data.success) {
                toast.success(data.message)
                setInputs({
                    roomType: '',
                    pricePerNight: 0,
                    amenities: {
                        'Free WiFi': false,
                        'Free Breakfast': false,
                        'Room Service': false,
                        'Mountain View': false,
                        'Pool Access': false
                    }
                })
                setImages({ 1: null, 2: null, 3: null, 4: null })
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!ownerHotels.length) {
            fetchOwnerHotels();
        }
    }, [ownerHotels, fetchOwnerHotels]);

    useEffect(() => {
        if (ownerHotels.length && !selectedHotelId) {
            setSelectedHotelId(ownerHotels[0]._id);
        }
    }, [ownerHotels, selectedHotelId]);

    const hotelsAvailable = ownerHotels.length > 0;

    return (
        <form onSubmit={onSubmitHandler}>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 mb-2">
                    🏨 Add Room
                </h1>
                <p className="text-gray-700 leading-relaxed">
                    Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.
                </p>
            </div>

            {/* Upload Images */}
            <div className="bg-gradient-to-br from-yellow-50 to-red-50 border-4 border-yellow-300 rounded-3xl p-6 shadow-xl mb-6">
                <p className='text-red-700 font-black text-xl mb-4 flex items-center gap-2'>
                    📸 Room Images
                </p>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {Object.keys(images).map((key) => (
                        <label 
                            key={key} 
                            htmlFor={`roomImage${key}`}
                            className="relative group cursor-pointer"
                        >
                            <div className="relative overflow-hidden rounded-2xl border-4 border-green-300 hover:border-red-400 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                                <img 
                                    className='w-full h-32 object-cover' 
                                    src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} 
                                    alt="" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold">Click to upload</span>
                                </div>
                            </div>
                            <input 
                                type="file" 
                                accept='image/*' 
                                id={`roomImage${key}`} 
                                hidden
                                onChange={e => setImages({ ...images, [key]: e.target.files[0] })} 
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Form Fields */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-4 border-green-300 rounded-3xl p-6 shadow-xl mb-6">
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Hotel Selection */}
                    <div>
                        <p className='text-green-700 font-black mb-2 flex items-center gap-2'>
                            🏨 Hotel
                        </p>
                        <select 
                            className='border-3 border-green-300 rounded-xl p-3 w-full font-semibold text-gray-700 focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all shadow-md hover:shadow-lg bg-white' 
                            value={selectedHotelId} 
                            onChange={(e) => setSelectedHotelId(e.target.value)}
                        >
                            <option value=''>Select Hotel</option>
                            {ownerHotels.map((hotel) => (
                                <option key={hotel._id} value={hotel._id}>{hotel.name} - {hotel.city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Room Type */}
                    <div>
                        <p className='text-red-700 font-black mb-2 flex items-center gap-2'>
                            🛏️ Room Type
                        </p>
                        <select 
                            className='border-3 border-red-300 rounded-xl p-3 w-full font-semibold text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-200 outline-none transition-all shadow-md hover:shadow-lg bg-white' 
                            value={inputs.roomType} 
                            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
                        >
                            <option value=''>Select Room Type</option>
                            <option value='Single Bed'>Single Bed</option>
                            <option value='Double Bed'>Double Bed</option>
                            <option value='Luxury Room'>Luxury Room</option>
                            <option value='Family Suite'>Family Suite</option>
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <p className='text-blue-700 font-black mb-2 flex items-center gap-2'>
                            💵 Price <span className='text-sm font-normal'>/night</span>
                        </p>
                        <input 
                            type="number" 
                            placeholder='0' 
                            className='border-3 border-blue-300 rounded-xl p-3 w-full font-bold text-gray-700 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition-all shadow-md hover:shadow-lg bg-white' 
                            value={inputs.pricePerNight} 
                            onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })} 
                        />
                    </div>
                </div>
            </div>

            {/* Amenities */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300 rounded-3xl p-6 shadow-xl mb-6">
                <p className='text-purple-700 font-black text-xl mb-4 flex items-center gap-2'>
                    ✨ Amenities
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {Object.keys(inputs.amenities).map((amenity, index) => (
                        <label 
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white border-2 border-purple-200 rounded-xl cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all group"
                        >
                            <input 
                                type='checkbox' 
                                id={`amenities${index + 1}`} 
                                checked={inputs.amenities[amenity]}
                                onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })}
                                className="w-5 h-5 text-purple-600 rounded border-2 border-purple-300 focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                                {amenity}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className='flex items-center gap-4'>
                <button 
                    type="submit"
                    className='bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white font-black px-10 py-4 rounded-2xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-yellow-400 text-lg' 
                    disabled={loading || !hotelsAvailable}
                >
                    {loading ? "🎁 Adding..." : "🎄 Add Room"}
                </button>
                {!hotelsAvailable && (
                    <div className="bg-red-100 border-3 border-red-400 rounded-xl px-4 py-2">
                        <p className='text-sm text-red-700 font-bold'>Please register a hotel before adding rooms.</p>
                    </div>
                )}
            </div>
        </form>
    )
}

export default AddRoom