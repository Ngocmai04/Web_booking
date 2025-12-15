import React, { useState } from 'react'
import Title from '../../components/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const AddHotel = () => {

    const { axios, getToken, fetchOwnerHotels } = useAppContext()
    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        name: '',
        address: '',
        contact: '',
        city: ''
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Check if all inputs are filled
        if (!inputs.name || !inputs.address || !inputs.contact || !inputs.city) {
            toast.error("Please fill in all the details")
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post('/api/hotels', inputs, { headers: { Authorization: `Bearer ${await getToken()}` } })

            if (data.success) {
                toast.success(data.message)
                setInputs({
                    name: '',
                    address: '',
                    contact: '',
                    city: ''
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
