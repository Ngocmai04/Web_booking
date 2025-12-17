import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { exclusiveOffers } from '../assets/assets'

const ExclusiveOffers = () => {
    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30 bg-gradient-to-b from-green-50 to-red-50'>
            {/* Christmas decoration */}
            <div className="text-3xl mb-6">
                🎅 🎄 ⭐
            </div>

            <div className='flex flex-col md:flex-row items-center justify-between w-full'>
                <Title
                    align="left"
                    variant="light"
                    title="🎁 Exclusive Christmas Offers"
                    subTitle="Take advantage of our limited-time holiday offers and special packages to enhance your stay and create unforgettable memories."
                />
                <button className='group flex items-center gap-2 font-semibold text-red-700 hover:text-red-800 cursor-pointer max-md:mt-12 transition-colors'>
                    View All Offers
                    <img className='group-hover:translate-x-1 transition-all' src={assets.arrowIcon} alt="arrow-icon" />
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
                {exclusiveOffers.map((item) => (
                    <div key={item._id} className='group relative overflow-hidden flex flex-col items-start justify-between gap-2 pt-14 px-5 rounded-2xl text-white bg-cover bg-center shadow-xl hover:shadow-2xl transition-all' style={{ backgroundImage: `url(${item.image})` }}>
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                        <div className="relative z-10 w-full">
                            <p className='px-4 py-1.5 absolute top-4 left-4 text-xs bg-red-600 text-white font-bold rounded-full shadow-lg border-2 border-white/50'>
                                🎄 {item.priceOff}% OFF
                            </p>
                            <div>
                                <p className="text-2xl font-playfair font-bold drop-shadow-lg mt-8">
                                    {item.title}
                                </p>
                                <p className="text-sm mt-2">{item.description}</p>
                                <p className='text-xs text-white/80 mt-3'>🎁 Expires {item.expiryDate}</p>
                            </div>
                            <button className="flex items-center gap-2 font-semibold mt-6 mb-5 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all">
                                View Offers
                                <img
                                    className="invert group-hover:translate-x-1 transition-all"
                                    src={assets.arrowIcon}
                                    alt="arrow-icon"
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExclusiveOffers