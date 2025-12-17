import React from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import StarRating from './StarRating';

const Testimonial = () => {
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
                    <div key={testimonial.id} className='bg-gradient-to-br from-red-50 to-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-red-100'>
                        <div className='flex items-center gap-3 mb-4'>
                            <img className='w-14 h-14 rounded-full border-2 border-red-200 shadow-md' src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className='font-playfair text-xl font-bold text-gray-800'>{testimonial.name}</p>
                                <p className='text-gray-600 text-sm'>{testimonial.location}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 mb-4'>
                            <StarRating />
                        </div>
                        <p className='text-gray-700 leading-relaxed'>"I've used many booking platforms before, but none compare to the personalized experience and attention to detail that QuickStay provides. Their curated selection of hotels is unmatched."</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonial;