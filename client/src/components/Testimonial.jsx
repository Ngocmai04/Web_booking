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
            <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-gradient-to-b from-red-50 via-white to-green-50 pt-20 pb-30'>
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className='text-center text-gray-600 font-semibold'>Loading testimonials...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-gradient-to-b from-red-50 via-white to-green-50 pt-20 pb-30'>
                <p className='text-center text-red-500'>Error: {error}</p>
            </div>
        );
    }

    if (testimonials.length === 0) {
        return (
            <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-gradient-to-b from-red-50 via-white to-green-50 pt-20 pb-30'>
                <p className='text-center text-gray-500'>No testimonials available yet</p>
            </div>
        );
    }

    return (
        <div className='relative flex flex-col items-center px-6 md:px-16 lg:px-24 bg-gradient-to-b from-red-50 via-white to-green-50 pt-20 pb-30 overflow-hidden'>
            {/* Animated snowflakes background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-white opacity-70 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 20 + 10}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 3 + 2}s`
                        }}
                    >
                        ❄
                    </div>
                ))}
            </div>

            {/* Christmas decoration header */}
            <div className="relative mb-8 flex items-center justify-center gap-4">
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎄</div>
                <div className="text-5xl animate-pulse text-yellow-400">⭐</div>
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</div>
                <div className="text-5xl animate-pulse text-yellow-400" style={{ animationDelay: '0.3s' }}>⭐</div>
                <div className="text-4xl animate-bounce" style={{ animationDelay: '1s' }}>🎄</div>
            </div>

            <Title
                title="What Our Guests Say"
                subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive holiday accommodations and unforgettable Christmas experiences around the world."
            />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full relative z-10'>
                {testimonials.map((testimonial, index) => (
                    <div
                        key={testimonial._id}
                        className='group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-red-300 hover:-translate-y-2 transform'
                        style={{
                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                        }}
                    >
                        {/* Christmas ornament decoration on top corner */}
                        <div className="absolute -top-4 -right-4 text-4xl group-hover:scale-125 transition-transform duration-300 group-hover:rotate-12">
                            🔴
                        </div>

                        {/* Sparkle effect on hover */}
                        <div className="absolute top-0 left-0 w-full h-full rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute top-4 right-8 text-2xl animate-ping">✨</div>
                            <div className="absolute bottom-8 left-8 text-2xl animate-ping" style={{ animationDelay: '0.3s' }}>✨</div>
                        </div>

                        {/* Christmas lights border effect */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute top-2 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <div className="absolute top-2 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="absolute bottom-2 left-4 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            <div className="absolute bottom-2 right-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-green-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className='relative z-10'>
                            <div className='flex items-center gap-4 mb-6'>
                                <div className='relative w-16 h-16 rounded-full border-3 border-red-300 shadow-lg bg-gradient-to-br from-red-500 via-red-400 to-pink-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6'>
                                    <span className='text-white font-bold text-xl'>
                                        {(testimonial.userInfo?.username || 'G')[0].toUpperCase()}
                                    </span>
                                    {/* Santa hat decoration */}
                                    <div className="absolute -top-3 -right-2 text-2xl group-hover:animate-bounce">🎅</div>
                                </div>
                                <div>
                                    <p className='font-playfair text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300'>
                                        {testimonial.userInfo?.username || 'Anonymous'}
                                    </p>
                                    <p className='text-gray-600 text-sm flex items-center gap-1'>
                                        <span>📍</span>
                                        {testimonial.hotelInfo?.city || 'Hotel'}
                                    </p>
                                </div>
                            </div>

                            {/* Star rating with animation */}
                            <div className='flex items-center gap-2 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl group-hover:from-yellow-100 group-hover:to-orange-100 transition-colors duration-300'>
                                <div className='flex gap-1'>
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`${i < Math.round(testimonial.ratings.overall) ? 'text-yellow-500' : 'text-gray-300'} text-2xl transition-all duration-300 group-hover:scale-125`}
                                            style={{
                                                transitionDelay: `${i * 0.1}s`,
                                                display: 'inline-block'
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className='ml-2 text-gray-700 font-semibold'>
                                    {testimonial.ratings.overall}/5
                                </span>
                            </div>

                            {/* Comment with Christmas quote styling */}
                            <div className="relative">
                                <div className="absolute -left-2 -top-2 text-4xl text-red-300 opacity-50">"</div>
                                <p className='text-gray-700 leading-relaxed pl-6 pr-6 text-base italic group-hover:text-gray-900 transition-colors duration-300'>
                                    {testimonial.comment || 'Great experience at this hotel!'}
                                </p>
                                <div className="absolute -right-2 -bottom-2 text-4xl text-green-300 opacity-50">"</div>
                            </div>

                            {/* Christmas tree decoration at bottom */}
                            <div className="mt-6 text-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-2xl">🎄</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom decoration */}
            <div className="mt-16 flex items-center gap-3 text-4xl">
                <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎅</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🦌</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>⛄</span>
                <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🎁</span>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Testimonial;