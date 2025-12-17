import React, { useState } from 'react'
import { cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Hero = () => {
    const { navigate, getToken, axios, setSearchedCities } = useAppContext()
    const [destination, setDestination] = useState('')

    const onSearch = async (e) => {
        e.preventDefault()
        navigate(`/rooms?destination=${destination}`)

        await axios.post(
            '/api/user/store-recent-search',
            { recentSearchedCity: destination },
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        )

        setSearchedCities((prev) => {
            const updated = [...prev, destination]
            if (updated.length > 3) updated.shift()
            return updated
        })
    }

    return (
        <section className="relative h-screen w-full flex items-center px-6 md:px-16 lg:px-24 xl:px-32 bg-[url('/src/assets/heroImage.png')] bg-cover bg-center bg-no-repeat">
            {/* Warm Christmas overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 via-orange-900/50 to-green-900/60" />

            <div className="relative z-10 w-full max-w-6xl">
                {/* Christmas Badge */}
                <span className="inline-block mb-6 px-5 py-2 rounded-full bg-red-600/80 backdrop-blur text-white text-sm font-semibold shadow-lg border-2 border-white/30">
                    🎄 Christmas Travel Special 2024
                </span>

                {/* Heading */}
                <h1 className="font-playfair text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.7)] max-w-3xl">
                    Discover Your Perfect
                    <span className="block bg-gradient-to-r from-red-300 via-yellow-200 to-green-300 bg-clip-text text-transparent">
                        Holiday Destination
                    </span>
                </h1>

                <p className="mt-6 text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
                    Unparalleled luxury, festive comfort and unforgettable experiences —
                    curated for your perfect Christmas getaway.
                </p>

                {/* Search Form */}
                <form onSubmit={onSearch} className="mt-14 w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                        {/* Destination */}
                        <div className="md:col-span-4 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-red-600 transition-colors">
                                📍 Destination
                            </label>
                            <input
                                list="destinations"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Where are you going?"
                                required
                                className="mt-2 w-full rounded-xl border-2 border-gray-200 px-5 py-3.5 text-sm text-gray-800 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            />
                            <datalist id="destinations">
                                {cities.map((city, index) => (
                                    <option key={index} value={city} />
                                ))}
                            </datalist>
                        </div>

                        {/* Check in */}
                        <div className="md:col-span-2 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-green-600 transition-colors">
                                📅 Check in
                            </label>
                            <input
                                type="date"
                                className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm text-gray-800 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            />
                        </div>

                        {/* Check out */}
                        <div className="md:col-span-2 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-green-600 transition-colors">
                                🎄 Check out
                            </label>
                            <input
                                type="date"
                                className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm text-gray-800 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            />
                        </div>

                        {/* Guests */}
                        <div className="md:col-span-2 group">
                            <label className="text-sm font-semibold text-gray-700 group-focus-within:text-red-600 transition-colors">
                                👨‍👩‍👧 Guests
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={4}
                                placeholder="1"
                                className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm text-gray-800 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            />
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-2 flex items-end">
                            <button className="w-full h-[56px] rounded-xl bg-gradient-to-r from-red-600 to-green-600 text-white text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                🎅 Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Hero