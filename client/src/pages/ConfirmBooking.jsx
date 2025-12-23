import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const ConfirmBooking = () => {
    const { bookingId, token } = useParams()
    const { axios } = useAppContext()
    const navigate = useNavigate()
    
    const [status, setStatus] = useState('loading') // loading, success, error, already
    const [message, setMessage] = useState('')

    useEffect(() => {
        const confirmBooking = async () => {
            try {
                const { data } = await axios.get(`/api/bookings/confirm/${bookingId}/${token}`)
                
                if (data.success) {
                    if (data.alreadyConfirmed) {
                        setStatus('already')
                        setMessage('This booking has already been confirmed.')
                    } else {
                        setStatus('success')
                        setMessage(data.message)
                        toast.success(data.message)
                    }
                } else {
                    setStatus('error')
                    setMessage(data.message)
                    toast.error(data.message)
                }
            } catch {
                setStatus('error')
                setMessage('Something went wrong. Please try again.')
                toast.error('Confirmation failed')
            }
        }

        if (bookingId && token) {
            confirmBooking()
        }
    }, [bookingId, token, axios])

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4'>
            <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center'>
                {status === 'loading' && (
                    <>
                        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-6'></div>
                        <h2 className='text-xl font-semibold text-gray-700'>Confirming your booking...</h2>
                        <p className='text-gray-500 mt-2'>Please wait a moment</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className='text-6xl mb-6'></div>
                        <h2 className='text-2xl font-bold text-green-600 mb-4'>Confirmed!</h2>
                        <p className='text-gray-600 mb-6'>{message}</p>
                        <p className='text-gray-500 mb-6'>Your booking is confirmed. You can view it in "My Bookings".</p>
                        <button 
                            onClick={() => navigate('/my-bookings')}
                            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
                        >
                            View My Bookings
                        </button>
                    </>
                )}

                {status === 'already' && (
                    <>
                        <div className='text-6xl mb-6'></div>
                        <h2 className='text-2xl font-bold text-blue-600 mb-4'>Already Confirmed</h2>
                        <p className='text-gray-600 mb-6'>{message}</p>
                        <button 
                            onClick={() => navigate('/my-bookings')}
                            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
                        >
                            View My Bookings
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className='text-6xl mb-6'></div>
                        <h2 className='text-2xl font-bold text-red-600 mb-4'>Confirmation Failed</h2>
                        <p className='text-gray-600 mb-6'>{message}</p>
                        <button 
                            onClick={() => navigate('/')}
                            className='bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors'
                        >
                            Back to Home
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default ConfirmBooking
