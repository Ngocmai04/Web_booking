import React, { useState } from 'react'
import Title from '../../components/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import OSMAddressAutocomplete from '../../components/hotelOwner/OSMAddressAutocomplete'

const AddHotel = () => {

    const { axios, getToken, fetchOwnerHotels } = useAppContext()
    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        name: '',
        address: '',
        contact: '',
        city: '',
        latitude: null,
        longitude: null,
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Check if all inputs are filled
        const hasCoords = Number.isFinite(inputs.latitude) && Number.isFinite(inputs.longitude)
        if (!inputs.name || !inputs.address || !inputs.contact || !inputs.city || !hasCoords) {
            toast.error("Please fill in all the details")
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...inputs,
                latitude: inputs.latitude,
                longitude: inputs.longitude,
            }
            const { data } = await axios.post('/api/hotels', payload, { headers: { Authorization: `Bearer ${await getToken()}` } })

            if (data.success) {
                toast.success(data.message)
                setInputs({
                    name: '',
                    address: '',
                    contact: '',
                    city: '',
                    latitude: null,
                    longitude: null,
                })
                // Refresh the owner hotels list
                fetchOwnerHotels();
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form onSubmit={onSubmitHandler}>
            <Title align='left' font='outfit' title='Add Hotel' subTitle='Fill in the details carefully with accurate hotel information to help customers find and book your property.' />

            <div className='w-full max-w-2xl'>
                <div className='mt-6'>
                    <p className='text-gray-800 font-medium'>Hotel Name</p>
                    <input 
                        type="text" 
                        name='name'
                        placeholder='Enter hotel name' 
                        className='border border-gray-300 mt-2 rounded p-3 w-full' 
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </div>

                <div className='mt-4'>
                    <p className='text-gray-800 font-medium'>Address</p>
                    <OSMAddressAutocomplete
                        value={inputs.address}
                        onChange={(next) => setInputs(prev => ({ ...prev, address: next, latitude: null, longitude: null }))}
                        onSelect={(picked) => setInputs(prev => ({
                            ...prev,
                            address: picked.displayName,
                            city: prev.city || picked.city,
                            latitude: picked.latitude,
                            longitude: picked.longitude,
                        }))}
                        placeholder='Search hotel address (OpenStreetMap)'
                        disabled={loading}
                    />
                    <p className='text-xs text-gray-500 mt-2'>
                        {Number.isFinite(inputs.latitude) && Number.isFinite(inputs.longitude)
                            ? `Selected coordinates: ${inputs.latitude}, ${inputs.longitude}`
                            : 'Pick an address from suggestions to save coordinates.'}
                    </p>
                </div>

                <div className='mt-4'>
                    <p className='text-gray-800 font-medium'>City</p>
                    <input 
                        type="text" 
                        name='city'
                        placeholder='Enter city' 
                        className='border border-gray-300 mt-2 rounded p-3 w-full' 
                        value={inputs.city}
                        onChange={handleChange}
                    />
                </div>

                <div className='mt-4'>
                    <p className='text-gray-800 font-medium'>Contact</p>
                    <input 
                        type="text" 
                        name='contact'
                        placeholder='Enter contact number or email' 
                        className='border border-gray-300 mt-2 rounded p-3 w-full' 
                        value={inputs.contact}
                        onChange={handleChange}
                    />
                </div>

                <button className='bg-blue-600 text-white px-8 py-3 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-8 font-medium hover:bg-blue-700 transition'>
                    {loading ? "Adding Hotel..." : "Add Hotel"}
                </button>
            </div>
        </form>
    )
}

export default AddHotel
