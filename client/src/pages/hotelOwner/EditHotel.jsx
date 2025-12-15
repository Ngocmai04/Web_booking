import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const EditHotel = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const { axios, getToken, ownerHotels, fetchOwnerHotels } = useAppContext()
    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        name: '',
        address: '',
        contact: '',
        city: ''
    })

    // Find the hotel to edit
    useEffect(() => {
        const hotel = ownerHotels.find(h => h._id === id);
        if (hotel) {
            setInputs({
                name: hotel.name,
                address: hotel.address,
                contact: hotel.contact,
                city: hotel.city
            })
        } else if (ownerHotels.length === 0) {
            fetchOwnerHotels();
        }
    }, [id, ownerHotels, fetchOwnerHotels])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Check if all inputs are filled
        if (!inputs.name || !inputs.address || !inputs.contact || !inputs.city) {
            toast.error("Please fill in all the details")
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.put(`/api/hotels/${id}`, inputs, { headers: { Authorization: `Bearer ${await getToken()}` } })

            if (data.success) {
                toast.success(data.message)
                fetchOwnerHotels();
                navigate('/owner/hotels')
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
            <Title align='left' font='outfit' title='Edit Hotel' subTitle='Update your hotel information' />

            <div className='w-full max-w-2xl'>
                <div className='mt-6'>
                    <p className='text-emerald-800 font-medium'>Hotel Name</p>
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
                    <p className='text-emerald-800 font-medium'>Address</p>
                    <input
                        type="text"
                        name='address'
                        placeholder='Enter hotel address'
                        className='border border-gray-300 mt-2 rounded p-3 w-full'
                        value={inputs.address}
                        onChange={handleChange}
                    />
                </div>

                <div className='mt-4'>
                    <p className='text-emerald-800 font-medium'>City</p>
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
                    <p className='text-emerald-800 font-medium'>Contact</p>
                    <input
                        type="text"
                        name='contact'
                        placeholder='Enter contact number or email'
                        className='border border-gray-300 mt-2 rounded p-3 w-full'
                        value={inputs.contact}
                        onChange={handleChange}
                    />
                </div>

                <div className='flex gap-4 mt-8'>
                    <button
                        type='submit'
                        className='bg-blue-600 text-white px-8 py-3 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-medium hover:bg-blue-700 transition'
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Hotel"}
                    </button>
                    <button
                        type='button'
                        onClick={() => navigate('/owner/hotels')}
                        className='bg-gray-600 text-white px-8 py-3 rounded cursor-pointer font-medium hover:bg-gray-700 transition'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    )
}

export default EditHotel
