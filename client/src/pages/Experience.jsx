import React from 'react';
import { useAppContext } from '../context/AppContext';

const Experience = () => {
    const { isOwner, navigate } = useAppContext();

    // SVG Icons
    const HotelIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21v-4m0 0V5a2 2 0 012-2h6a2 2 0 012 2v12M3 17h12m0 0v4m0-4V9a2 2 0 012-2h4a2 2 0 012 2v8m-6 4h6m-9-4h.01M9 9h.01M9 13h.01M17 13h.01" />
        </svg>
    );

    const LockIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
    );

    const StarIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );

    const GlobeIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
    );

    const BuildingIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16a2 2 0 002-2V7L12 2z" />
            <path d="M12 22V12M8 12h8" />
        </svg>
    );

    const ChartIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18 17V9M13 17V5M8 17v-3" />
        </svg>
    );

    const ReceiptIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
            <path d="M16 8h-6M16 12h-6M16 16h-6" />
        </svg>
    );

    const TrendingIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 6l-9.5 9.5-5-5L1 18" />
            <path d="M17 6h6v6" />
        </svg>
    );

    const CheckIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
        </svg>
    );

    const travelerFeatures = [
        {
            icon: <HotelIcon />,
            title: 'Curated Hotels',
            description: 'Carefully verified hotels to ensure quality & comfort for every stay.',
            gradient: 'from-red-500 to-rose-500'
        },
        {
            icon: <LockIcon />,
            title: 'Secure Booking',
            description: 'Transparent pricing with secure payment processing you can trust.',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: <StarIcon />,
            title: 'Real Reviews',
            description: 'Only verified guests can leave reviews. Authentic experiences only.',
            gradient: 'from-yellow-500 to-amber-500'
        },
        {
            icon: <GlobeIcon />,
            title: 'Global Destinations',
            description: 'Hotels across multiple destinations. Your perfect stay awaits.',
            gradient: 'from-red-600 to-orange-500'
        }
    ];

    const ownerFeatures = [
        {
            icon: <BuildingIcon />,
            title: 'Easy Property Management',
            description: 'Add hotels, rooms, pricing, and availability in minutes with our intuitive dashboard.',
            gradient: 'from-green-600 to-teal-500'
        },
        {
            icon: <ChartIcon />,
            title: 'Owner Dashboard',
            description: 'Manage bookings, rooms, and guest feedback all in one powerful platform.',
            gradient: 'from-red-500 to-pink-500'
        },
        {
            icon: <ReceiptIcon />,
            title: 'Transparent Commission',
            description: 'No hidden fees. Clear pricing structure so you know exactly what you pay.',
            gradient: 'from-yellow-500 to-orange-500'
        },
        {
            icon: <TrendingIcon />,
            title: 'Reach More Travelers',
            description: 'Increase visibility and bookings with our growing traveler community.',
            gradient: 'from-green-500 to-lime-500'
        }
    ];

    const trustFeatures = [
        {
            icon: <CheckIcon />,
            title: 'Hotel Verification Process',
            description: 'Every hotel goes through rigorous verification before listing'
        },
        {
            icon: <CheckIcon />,
            title: 'Owner Identity Validation',
            description: 'All hotel owners are verified to ensure legitimacy'
        },
        {
            icon: <CheckIcon />,
            title: 'Anti-Fraud & Review Moderation',
            description: 'Advanced systems to prevent fraud and maintain review integrity'
        },
        {
            icon: <CheckIcon />,
            title: 'Admin Oversight System',
            description: '24/7 monitoring to maintain platform quality and trust'
        }
    ];

    return (
        <div className='bg-gradient-to-b from-red-50 via-white to-green-50'>
            {/* Hero Section */}
            <section className='relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-green-700'>
                {/* Animated snowflakes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-snowfall text-white/60"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                                fontSize: `${Math.random() * 20 + 10}px`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 10 + 15}s`
                            }}
                        >
                            ❄
                        </div>
                    ))}
                </div>

                {/* Christmas lights decoration */}
                <div className="absolute top-0 left-0 right-0 h-16 flex justify-around items-center">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full animate-twinkle"
                            style={{
                                backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff'][i % 5],
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>

                {/* Floating ornaments */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float text-4xl"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 8 + 12}s`
                            }}
                        >
                            {['🎄', '⭐', '🎁', '🔔', '🎅'][Math.floor(Math.random() * 5)]}
                        </div>
                    ))}
                </div>

                <div className='relative z-10 text-center px-6 md:px-16 lg:px-24 max-w-5xl'>
                    <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                        🎄 Discover The Difference
                    </div>

                    <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight'>
                        More Than a Stay —<br />
                        <span className='bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-300'>
                            It's an Experience
                        </span>
                    </h1>

                    <p className='text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-light'>
                        Handpicked hotels, trusted owners, seamless booking.
                    </p>

                    <div className='flex flex-wrap gap-4 justify-center'>
                        <button
                            onClick={() => navigate('/rooms')}
                            className='group px-8 py-4 bg-white text-red-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 relative overflow-hidden'
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Explore Hotels
                                <span className="group-hover:rotate-12 transition-transform duration-300">✨</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-rose-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                        <button
                            onClick={() => {
                                const element = document.getElementById('for-travelers');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className='group px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 relative overflow-hidden'
                        >
                            <span className="relative z-10">Learn More</span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </div>
                </div>

                {/* Decorative wave at bottom */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(254 242 242)" />
                    </svg>
                </div>
            </section>

            {/* Experiences for Travelers */}
            <section id="for-travelers" className='px-6 md:px-16 lg:px-24 py-20'>
                <div className='max-w-7xl mx-auto'>
                    <div className='text-center mb-16'>
                        <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full text-red-600 text-sm font-bold">
                            🎄 FOR TRAVELERS
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Designed for Travelers
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Every feature crafted to make your booking experience seamless and delightful.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {travelerFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className='group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-red-100 overflow-hidden'
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Sparkle effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-sparkle"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                                animationDelay: `${i * 0.1}s`
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Icon */}
                                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                                    <div className="absolute inset-0 rounded-2xl bg-white/20 group-hover:animate-ping"></div>
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300'>
                                    {feature.title}
                                </h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    {feature.description}
                                </p>

                                {/* Hover border glow */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                            </div>
                        ))}
                    </div>

                    <div className='text-center mt-12'>
                        <button
                            onClick={() => navigate('/rooms')}
                            className='group px-10 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden'
                        >
                            <span className="relative z-10 flex items-center gap-2 justify-center">
                                Explore Hotels
                                <span className="group-hover:scale-125 transition-transform duration-300">🏨</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Experiences for Hotel Owners */}
            <section className='px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-red-50 to-white'>
                <div className='max-w-7xl mx-auto'>
                    <div className='text-center mb-16'>
                        <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full text-green-600 text-sm font-bold">
                            🎁 FOR HOTEL OWNERS
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Built for Hotel Owners
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Powerful tools to manage your properties and grow your business.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {ownerFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className='group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-green-100 overflow-hidden'
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1 + 0.2}s both`
                                }}
                            >
                                {/* Snow effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute text-green-200 text-xs animate-snowfall"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `-10%`,
                                                animationDelay: `${i * 0.2}s`,
                                                animationDuration: '3s'
                                            }}
                                        >
                                            ❄
                                        </div>
                                    ))}
                                </div>

                                {/* Icon */}
                                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                                    <div className="absolute inset-0 rounded-2xl bg-white/20 group-hover:animate-ping"></div>
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300'>
                                    {feature.title}
                                </h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    {feature.description}
                                </p>

                                {/* Hover border glow */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                            </div>
                        ))}
                    </div>

                    {!isOwner && (
                        <div className='text-center mt-12'>
                            <button
                                onClick={() => navigate('/owner')}
                                className='group px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden'
                            >
                                <span className="relative z-10 flex items-center gap-2 justify-center">
                                    List Your Hotel
                                    <span className="group-hover:rotate-12 transition-transform duration-300">🏗️</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Trust & Quality */}
            <section className='px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-white to-green-50'>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-16'>
                        <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm font-bold">
                            ⭐ TRUST & QUALITY
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Your Trust, Our Priority
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Multiple layers of verification to ensure quality and security.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
                        {trustFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className='group flex gap-4 items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-yellow-100 hover:-translate-y-1 hover:border-yellow-300 relative overflow-hidden'
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                                <div className='text-green-600 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className='text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-gray-600'>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className='px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-br from-red-600 via-red-700 to-green-700'>
                <div className='max-w-4xl mx-auto text-center'>
                    <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                        🎄 Ready to Get Started?
                    </h2>
                    <p className='text-xl text-white/90 mb-10 max-w-2xl mx-auto'>
                        Join thousands of travelers and hotel owners on Paradise Hotel.
                    </p>

                    <div className='flex flex-wrap gap-4 justify-center'>
                        <button
                            onClick={() => navigate('/rooms')}
                            className='group px-10 py-4 bg-white text-red-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 relative overflow-hidden'
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Find Your Next Stay
                                <span className="group-hover:scale-125 transition-transform duration-300">🏨</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                        {!isOwner && (
                            <button
                                onClick={() => navigate('/owner')}
                                className='group px-10 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 relative overflow-hidden'
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Become a Partner
                                    <span className="group-hover:rotate-12 transition-transform duration-300">🤝</span>
                                </span>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Animations */}
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

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }

                @keyframes snowfall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0.3;
                    }
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.3;
                        transform: scale(0.8);
                    }
                }

                @keyframes sparkle {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.5);
                    }
                }

                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }

                .animate-snowfall {
                    animation: snowfall 20s linear infinite;
                }

                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
                }

                .animate-sparkle {
                    animation: sparkle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Experience;