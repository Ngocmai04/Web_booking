import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import Title from './Title'
import HotelCard from './HotelCard'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext()
  const [recommended, setRecommended] = useState([])

  // ✅ useCallback để fix ESLint warning
  const filterHotels = useCallback(() => {
    const filteredHotels = rooms.filter(
      (room) =>
        room &&
        room.hotel &&
        searchedCities.includes(room.hotel.city)
    )
    setRecommended(filteredHotels)
  }, [rooms, searchedCities])

  useEffect(() => {
    filterHotels()
  }, [filterHotels])

  if (recommended.length === 0) return null

  return (
    <motion.div
      className="flex flex-col items-center px-6 md:px-16 lg:px-24 py-20 bg-gradient-to-b from-red-50 to-green-50"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Decorative Christmas elements */}
      <motion.div
        className="text-4xl mb-6 opacity-70"
        variants={cardVariants}
      >
        🎄 ❄️ 🎁
      </motion.div>

      <motion.div variants={cardVariants}>
        <Title
          title="🎅 Recommended Christmas Stays"
          subTitle="Discover our handpicked selection of exceptional properties perfect for your holiday season, offering festive luxury and unforgettable experiences."
        />
      </motion.div>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-6 mt-16"
        variants={containerVariants}
      >
        {recommended.slice(0, 4).map((room) => (
          <motion.div key={room._id} variants={cardVariants}>
            <HotelCard room={room} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default RecommendedHotels
