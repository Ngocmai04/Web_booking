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
        // Check if all inputs are filled
        if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image => image) || !selectedHotelId) {
            toast.error("Please fill in all the details")
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData()
            formData.append('roomType', inputs.roomType)
            formData.append('pricePerNight', inputs.pricePerNight)
            // Converting Amenities to Array & keeping only enabled Amenities
            const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key])
            formData.append('amenities', JSON.stringify(amenities))
            formData.append('hotelId', selectedHotelId)

            // Adding Images to FormData
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
            <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.' />
            {/* Upload Area For Images */}
            <p className='text-red-600 mt-10'>Images</p>
            <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`roomImage${key}`}>
                        <img className='max-h-13 cursor-pointer opacity-80' src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
                        <input type="file" accept='image/*' id={`roomImage${key}`} hidden
                            onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
                    </label>
                ))}
            </div>

            <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>

                <div className='flex-1 max-w-48'>
                    <p className='text-red-600 mt-4'>Hotel</p>
                    <select className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' value={selectedHotelId} onChange={(e) => setSelectedHotelId(e.target.value)}>
                        <option value=''>Select Hotel</option>
                        {ownerHotels.map((hotel) => (
                            <option key={hotel._id} value={hotel._id}>{hotel.name} - {hotel.city}</option>
                        ))}
                    </select>
                </div>

                <div className='flex-1 max-w-48'>
                    <p className='text-red-600 mt-4'>Room Type</p>
                    <select className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' value={inputs.roomType} onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}>
                        <option value=''>Select Room Type</option>
                        <option value='Single Bed'>Single Bed</option>
                        <option value='Double Bed'>Double Bed</option>
                        <option value='Luxury Room'>Luxury Room</option>
                        <option value='Family Suite'>Family Suite</option>
                    </select>
                </div>

                <div>
                    <p className='mt-4 text-red-600'>Price <span className='text-xs'>/night</span></p>
                    <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' value={inputs.pricePerNight} onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })} />
                </div>

            </div>

            <p className='text-red-600 mt-4'>Amenities</p>
            <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
                {Object.keys(inputs.amenities).map((amenity, index) => (
                    <div key={index}>
                        <input type='checkbox' id={`amenities${index + 1}`} checked={inputs.amenities[amenity]}
                            onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })}
                        />
                        <label htmlFor={`amenities${index + 1}`}> {amenity} </label>
                    </div>
                ))}
            </div>

            <div className='flex items-center gap-4 mt-8'>
                <button className='bg-primary text-white px-8 py-2 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed' disabled={loading || !hotelsAvailable}>
                    {loading ? "Adding..." : "Add Room"}
                </button>
                {!hotelsAvailable && <p className='text-sm text-red-500'>Please register a hotel before adding rooms.</p>}
            </div>
        </form>
    )
}

export default AddRoom
