import React from 'react';

const About = () => {
    const ecosystem = [
        {
            role: 'User (Guest)',
            icon: '👤',
            color: 'from-blue-500 to-cyan-500',
            features: [
                'Search hotels worldwide',
                'Book rooms securely',
                'Leave honest reviews',
                'Save favorite properties'
            ]
        },
        {
            role: 'Hotel Owner',
            icon: '🏨',
            color: 'from-purple-500 to-pink-500',
            features: [
                'Register hotel properties',
                'Manage rooms & pricing',
                'Handle bookings efficiently',
                'Respond to guest feedback'
            ]
        },
        {
            role: 'Admin',
            icon: '🛡️',
            color: 'from-green-500 to-emerald-500',
            features: [
                'Verify hotels & owners',
                'Moderate reviews & content',
                'Maintain platform integrity',
                'Ensure quality standards'
            ]
        }
    ];

    const values = [
        {
            icon: '🔍',
            title: 'Transparency',
            description: 'Clear pricing, honest reviews, and open communication at every step.',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: '🤝',
            title: 'Trust',
            description: 'Building lasting relationships through verified hotels and authenticated users.',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: '✨',
            title: 'User Experience',
            description: 'Intuitive design and seamless booking process for all user types.',
            gradient: 'from-orange-500 to-red-500'
        },
        {
            icon: '🌱',
            title: 'Long-term Partnership',
            description: 'Supporting hotel owners with tools and resources to grow their business.',
            gradient: 'from-purple-500 to-pink-500'
        }
    ];

    return (
        <div className='bg-gradient-to-b from-slate-50 via-white to-slate-50'>
            {/* Hero Section */}
            <section className='relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
                <div className='relative z-10 text-center px-6 md:px-16 lg:px-24 max-w-4xl'>
                    <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                        About Paradise Hotel
                    </div>
                    
                    <h1 className='text-5xl md:text-6xl font-bold text-white mb-6'>
                        Connecting Travelers<br />
                        <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>
                            With Trusted Hotels
                        </span>
                    </h1>
                    
                    <p className='text-xl text-white/80 max-w-2xl mx-auto'>
                        A modern booking platform built on transparency, trust, and quality.
                    </p>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)"/>
                    </svg>
                </div>
            </section>

            {/* Our Story */}
            <section className='px-6 md:px-16 lg:px-24 py-20'>
                <div className='max-w-4xl mx-auto'>
                    <div className='text-center mb-12'>
                        <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-bold">
                            OUR STORY
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
                            Who We Are
                        </h2>
                    </div>

                    <div className='bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100'>
                        <p className='text-lg md:text-xl text-gray-700 leading-relaxed mb-6'>
                            <span className='font-bold text-indigo-600'>Paradise Hotel</span> was built to connect travelers with trusted hotels and empower hotel owners through a modern booking platform.
                        </p>
                        <p className='text-lg text-gray-600 leading-relaxed mb-6'>
                            We understand that booking accommodation should be simple, transparent, and reliable. That's why we created a platform where quality meets convenience, bringing together travelers seeking authentic experiences and hotel owners committed to exceptional service.
                        </p>
                        <p className='text-lg text-gray-600 leading-relaxed'>
                            Our three-tier ecosystem ensures that every stakeholder—guests, hotel owners, and administrators—has the tools they need to succeed in the modern hospitality landscape.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className='px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-white to-slate-50'>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Mission & Vision
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {/* Mission */}
                        <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-3xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300'>
                            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg'>
                                🎯
                            </div>
                            <h3 className='text-2xl font-bold text-gray-900 mb-6'>Our Mission</h3>
                            <ul className='space-y-4'>
                                <li className='flex items-start gap-3'>
                                    <span className='text-blue-600 font-bold mt-1'>✓</span>
                                    <span className='text-gray-700'>Simplify hotel booking for travelers worldwide</span>
                                </li>
                                <li className='flex items-start gap-3'>
                                    <span className='text-blue-600 font-bold mt-1'>✓</span>
                                    <span className='text-gray-700'>Ensure transparency in pricing and reviews</span>
                                </li>
                                <li className='flex items-start gap-3'>
                                    <span className='text-blue-600 font-bold mt-1'>✓</span>
                                    <span className='text-gray-700'>Support hotel owners with modern tools</span>
                                </li>
                                <li className='flex items-start gap-3'>
                                    <span className='text-blue-600 font-bold mt-1'>✓</span>
                                    <span className='text-gray-700'>Maintain high standards through verification</span>
                                </li>
                            </ul>
                        </div>

                        {/* Vision */}
                        <div className='bg-gradient-to-br from-purple-50 to-pink-50 p-10 rounded-3xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300'>
                            <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg'>
                                🚀
                            </div>
                            <h3 className='text-2xl font-bold text-gray-900 mb-6'>Our Vision</h3>
                            <ul className='space-y-4'>
                                <li className='flex items-start gap-3'>
                                    <span className='text-purple-600 font-bold mt-1'>✓</span>
                                    <span className='text-gray-700'>Become a trusted global hotel booking platform</span>
                                </li>
                                <li className='flex items-start gap-3'>
                                    <span className='text-purple-600 font-bold mt-1'>✓</span>
                                    <span className='text-gray-700'>Focus on quality over quantity</span>
                                </li>
                                <li className='flex items-start gap-3'>
                                    <span className='text-purple-600 font-bold mt-1'>✓</span>
                                    <span className='text-gray-700'>Create lasting partnerships with hotel owners</span>
                                </li>
                                <li className='flex items-start gap-3'>
                                    <span className='text-purple-600 font-bold mt-1'>✓</span>
                                    <span className='text-gray-700'>Set industry standards for transparency</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How Paradise Hotel Works - Ecosystem */}
            <section className='px-6 md:px-16 lg:px-24 py-20'>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-16'>
                        <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full text-green-600 text-sm font-bold">
                            OUR ECOSYSTEM
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            How Paradise Hotel Works
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            A three-tier system designed for seamless interaction between all stakeholders.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {ecosystem.map((item, index) => (
                            <div
                                key={index}
                                className='bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100'
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                                }}
                            >
                                {/* Icon */}
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl mb-6 shadow-lg mx-auto`}>
                                    {item.icon}
                                </div>

                                {/* Role */}
                                <h3 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                                    {item.role}
                                </h3>

                                {/* Features */}
                                <ul className='space-y-3'>
                                    {item.features.map((feature, idx) => (
                                        <li key={idx} className='flex items-start gap-2'>
                                            <span className='text-green-500 mt-1'>✓</span>
                                            <span className='text-gray-600'>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Decorative gradient */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 hover:opacity-5 transition-opacity duration-300`}></div>
                            </div>
                        ))}
                    </div>

                    {/* Connection arrows for desktop */}
                    <div className='hidden md:flex justify-center items-center gap-4 mt-8 text-4xl text-gray-300'>
                        <span>↔</span>
                        <span>↔</span>
                    </div>
                </div>
            </section>

            {/* Why Choose Paradise Hotel */}
            <section className='px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-slate-50 to-white'>
                <div className='max-w-5xl mx-auto'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Why Choose Paradise Hotel
                        </h2>
                        <p className='text-xl text-gray-600'>
                            See how we stand out from the competition.
                        </p>
                    </div>

                    <div className='bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100'>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
                                    <th className='px-6 py-4 text-left text-lg font-bold'>Feature</th>
                                    <th className='px-6 py-4 text-center text-lg font-bold'>Paradise Hotel</th>
                                    <th className='px-6 py-4 text-center text-lg font-bold'>Others</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                <tr className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 font-semibold text-gray-900'>Hotel Quality</td>
                                    <td className='px-6 py-4 text-center'>
                                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold'>
                                            ✓ Verified Hotels
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-center text-gray-500'>Mixed Quality</td>
                                </tr>
                                <tr className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 font-semibold text-gray-900'>Owner Tools</td>
                                    <td className='px-6 py-4 text-center'>
                                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold'>
                                            ✓ Full Dashboard
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-center text-gray-500'>Limited Tools</td>
                                </tr>
                                <tr className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 font-semibold text-gray-900'>Pricing</td>
                                    <td className='px-6 py-4 text-center'>
                                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold'>
                                            ✓ Transparent
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-center text-gray-500'>Hidden Fees</td>
                                </tr>
                                <tr className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 font-semibold text-gray-900'>Reviews</td>
                                    <td className='px-6 py-4 text-center'>
                                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold'>
                                            ✓ Verified Only
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-center text-gray-500'>Unverified</td>
                                </tr>
                                <tr className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-4 font-semibold text-gray-900'>Support</td>
                                    <td className='px-6 py-4 text-center'>
                                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold'>
                                            ✓ 24/7 Oversight
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-center text-gray-500'>Limited</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Platform Values */}
            <section className='px-6 md:px-16 lg:px-24 py-20'>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-16'>
                        <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-bold">
                            OUR VALUES
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            What We Stand For
                        </h2>
                        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                            Core principles that guide everything we do.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className='group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100'
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                                    {value.icon}
                                </div>
                                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                                    {value.title}
                                </h3>
                                <p className='text-gray-600 leading-relaxed'>
                                    {value.description}
                                </p>
                            </div>
                        ))}
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
            `}</style>
        </div>
    );
};

export default About;
