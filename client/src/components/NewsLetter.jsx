import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'

const NewsLetter = () => {
    return (
        <div className='flex flex-col items-center max-w-5xl lg:w-full rounded-3xl px-6 py-16 mx-2 lg:mx-auto my-30 bg-gradient-to-br from-red-900 via-red-800 to-green-900 text-white shadow-2xl border-4 border-yellow-400/30 relative overflow-hidden'>
            {/* Decorative Christmas elements */}
            <div className="absolute top-6 left-6 text-4xl opacity-20">🎄</div>
            <div className="absolute bottom-6 right-6 text-4xl opacity-20">❄️</div>
            <div className="absolute top-1/2 left-1/4 text-3xl opacity-10">⭐</div>
            <div className="absolute top-1/3 right-1/4 text-3xl opacity-10">🎁</div>

            <div className="relative z-10 flex flex-col items-center w-full">
                <div className="text-4xl mb-4">
                    🎅
                </div>

                {/* Custom Title for Newsletter */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-4">
                        Stay Inspired This Christmas
                    </h2>
                    <p className="text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                        Join our newsletter and be the first to discover new holiday destinations, exclusive festive offers, and seasonal travel inspiration.
                    </p>
                </div>

                <div className='flex flex-col md:flex-row items-center justify-center gap-4 mt-8 w-full max-w-2xl'>
                    <input
                        type="email"
                        className='bg-white px-5 py-3.5 border-2 border-gray-300 rounded-xl outline-none w-full text-gray-800 placeholder:text-gray-500 focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all'
                        placeholder='Enter your email'
                    />
                    <button className='flex items-center justify-center gap-2 group bg-white text-red-700 px-6 md:px-8 py-3.5 rounded-xl font-bold hover:bg-red-50 active:scale-95 transition-all shadow-lg whitespace-nowrap'>
                        Subscribe
                        <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 group-hover:translate-x-1 transition-all' />
                    </button>
                </div>

                <p className='text-white/90 mt-6 text-xs text-center max-w-md'>
                    By subscribing, you agree to our Privacy Policy and consent to receive holiday updates and special offers.
                </p>
            </div>
        </div>
    )
}

export default NewsLetter