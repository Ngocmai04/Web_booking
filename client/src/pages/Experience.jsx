import React from 'react';
import { useAppContext } from '../context/AppContext';

const Experience = () => {
    const { isOwner, navigate } = useAppContext();

    const travelerFeatures = [
        {
            icon: '🏨',
            title: 'Curated Hotels',
            description: 'Carefully verified hotels to ensure quality & comfort for every stay.',
            gradient: 'from-red-500 to-rose-500'
        },
        {
            icon: '🔒',
            title: 'Secure Booking',
            description: 'Transparent pricing with secure payment processing you can trust.',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: '⭐',
            title: 'Real Reviews',
            description: 'Only verified guests can leave reviews. Authentic experiences only.',
            gradient: 'from-yellow-500 to-amber-500'
        },
        {
            icon: '🌍',
            title: 'Global Destinations',
            description: 'Hotels across multiple destinations. Your perfect stay awaits.',
            gradient: 'from-red-600 to-orange-500'
        }
    ];

    const ownerFeatures = [
        {
            icon: '🏗️',
            title: 'Easy Property Management',
            description: 'Add hotels, rooms, pricing, and availability in minutes with our intuitive dashboard.',
            gradient: 'from-green-600 to-teal-500'
        },
        {
            icon: '📊',
            title: 'Owner Dashboard',
            description: 'Manage bookings, rooms, and guest feedback all in one powerful platform.',
            gradient: 'from-red-500 to-pink-500'
        },
        {
            icon: '🧾',
            title: 'Transparent Commission',
            description: 'No hidden fees. Clear pricing structure so you know exactly what you pay.',
            gradient: 'from-yellow-500 to-orange-500'
        },
        {
            icon: '📈',
            title: 'Reach More Travelers',
            description: 'Increase visibility and bookings with our growing traveler community.',
            gradient: 'from-green-500 to-lime-500'
        }
    ];

    const trustFeatures = [
        {
            icon: '✔️',
            title: 'Hotel Verification Process',
            description: 'Every hotel goes through rigorous verification before listing'
        },
        {
            icon: '✔️',
            title: 'Owner Identity Validation',
            description: 'All hotel owners are verified to ensure legitimacy'
        },
        {
            icon: '✔️',
            title: 'Anti-Fraud & Review Moderation',
            description: 'Advanced systems to prevent fraud and maintain review integrity'
        },
        {
            icon: '✔️',
            title: 'Admin Oversight System',
            description: '24/7 monitoring to maintain platform quality and trust'
        }
    ];

    return (
        <div className='bg-gradient-to-b from-red-50 via-white to-green-50'>
            {/* Hero Section */}
            <section className='relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-green-700'>
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 10 + 10}s`
                            }}
                        >
                            {['🏨', '⭐', '🎄', '✨', '🎁'][Math.floor(Math.random() * 5)]}
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
                            className='px-8 py-4 bg-white text-red-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300'
                        >
                            Explore Hotels ✨
                        </button>
                        <button
                            onClick={() => {
                                const element = document.getElementById('for-travelers');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className='px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300'
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Decorative wave at bottom */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(254 242 242)"/>
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
                                className='group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100'
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                                    {feature.title}
                                </h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    {feature.description}
                                </p>

                                {/* Hover effect */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                            </div>
                        ))}
                    </div>

                    <div className='text-center mt-12'>
                        <button
                            onClick={() => navigate('/rooms')}
                            className='px-10 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300'
                        >
                            Explore Hotels 🏨
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
                                className='group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100'
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1 + 0.2}s both`
                                }}
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                                    {feature.title}
                                </h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    {feature.description}
                                </p>

                                {/* Hover effect */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                            </div>
                        ))}
                    </div>

                    {!isOwner && (
                        <div className='text-center mt-12'>
                            <button
                                onClick={() => navigate('/owner')}
                                className='px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300'
                            >
                                List Your Hotel 🏗️
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
                                className='flex gap-4 items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-yellow-100'
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className='text-3xl flex-shrink-0'>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className='text-lg font-bold text-gray-900 mb-2'>
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
                            className='px-10 py-4 bg-white text-red-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300'
                        >
                            Find Your Next Stay 🏨
                        </button>
                        {!isOwner && (
                            <button
                                onClick={() => navigate('/owner')}
                                className='px-10 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300'
                            >
                                Become a Partner 🤝
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

                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Experience;
