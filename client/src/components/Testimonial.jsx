import React, { useState, useEffect } from 'react';
import Title from './Title';
import StarRating from './StarRating';

const Testimonial = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/ratings/testimonials/random`;
                console.log('Fetching from:', apiUrl);
                
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                console.log('Response data:', data);
                
                if (data.success && data.testimonials) {
                    console.log('Testimonials loaded:', data.testimonials);
                    setTestimonials(data.testimonials);
                } else {
                    console.warn('No testimonials found or request not successful');
                    setError('No testimonials available');
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) {
        return (
            <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-white pt-20 pb-30'>
                <p className='text-center text-gray-500'>Loading testimonials...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-white pt-20 pb-30'>
                <p className='text-center text-red-500'>Error: {error}</p>
            </div>
        );
    }

    if (testimonials.length === 0) {
        return (
            <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-white pt-20 pb-30'>
                <p className='text-center text-gray-500'>No testimonials available yet</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-white pt-20 pb-30'>
            {/* Christmas decoration */}
            <div className="text-3xl mb-6">
                ⭐ 🎄 ⭐
            </div>

            <Title
                title="What Our Guests Say"
                subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive holiday accommodations and unforgettable Christmas experiences around the world."
            />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full'>
                {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className='bg-gradient-to-br from-red-50 to-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-red-100'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='w-14 h-14 rounded-full border-2 border-red-200 shadow-md bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center flex-shrink-0'>
                                <span className='text-white font-bold text-lg'>
                                    {(testimonial.userInfo?.username || 'G')[0].toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className='font-playfair text-xl font-bold text-gray-800'>{testimonial.userInfo?.username || 'Anonymous'}</p>
                                <p className='text-gray-600 text-sm'>{testimonial.hotelInfo?.city || 'Hotel'}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 mb-4'>
                            <div className='flex gap-0.5'>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.round(testimonial.ratings.overall) ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className='ml-2 text-gray-600 text-sm'>({testimonial.ratings.overall}/5)</span>
                        </div>
                        <p className='text-gray-700 leading-relaxed'>"{testimonial.comment || 'Great experience at this hotel!'}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonial;