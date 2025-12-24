import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Title from './Title'

const MotionDiv = motion.div
const MotionSpan = motion.span

/* ===== Animation variants ===== */
const sectionFade = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut' },
  },
}

const staggerGrid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardFade = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/ratings/testimonials/random`
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (data.success && data.testimonials) {
          setTestimonials(data.testimonials)
        } else {
          setError('No testimonials available')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 pt-20 pb-30">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-semibold">Loading testimonials...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center pt-20 pb-30 text-red-500">
        Error: {error}
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <div className="flex justify-center pt-20 pb-30 text-gray-500">
        No testimonials available yet
      </div>
    )
  }

  return (
    <MotionDiv
      className="relative flex flex-col items-center px-6 md:px-16 lg:px-24 bg-gradient-to-b from-red-50 via-white to-green-50 pt-20 pb-30 overflow-hidden"
      variants={sectionFade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header decoration */}
      <MotionDiv
        className="relative mb-8 flex items-center justify-center gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-4xl">🎄</span>
        <span className="text-5xl text-yellow-400">⭐</span>
        <span className="text-4xl">🎁</span>
      </MotionDiv>

      <Title
        title="What Our Guests Say"
subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive holiday accommodations and unforgettable Christmas experiences around the world."
      />

      {/* Testimonials grid */}
      <MotionDiv
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full relative z-10"
        variants={staggerGrid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {testimonials.map((testimonial) => (
          <MotionDiv
            key={testimonial._id}
            variants={cardFade}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-red-300"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {(testimonial.userInfo?.username || 'G')[0].toUpperCase()}
                <span className="absolute -top-3 -right-2 text-2xl">🎅</span>
              </div>
              <div>
                <p className="font-playfair text-xl font-bold text-gray-800">
                  {testimonial.userInfo?.username || 'Anonymous'}
                </p>
                <p className="text-gray-600 text-sm">
                  📍 {testimonial.hotelInfo?.city || 'Hotel'}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6 bg-yellow-50 p-3 rounded-xl">
              {[...Array(5)].map((_, i) => (
                <MotionSpan
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-2xl ${
                    i < Math.round(testimonial.ratings.overall)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </MotionSpan>
              ))}
              <span className="ml-2 font-semibold text-gray-700">
                {testimonial.ratings.overall}/5
              </span>
            </div>

            {/* Comment */}
            <p className="text-gray-700 italic leading-relaxed">
              “{testimonial.comment || 'Great experience at this hotel!'}”
            </p>

            <div className="mt-6 text-center opacity-60">
              <span className="text-2xl">🎄</span>
            </div>
          </MotionDiv>
        ))}
      </MotionDiv>

      {/* Footer decoration */}
      <MotionDiv
        className="mt-16 flex gap-3 text-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
transition={{ delay: 0.5 }}
      >
        🎅 🦌 ⛄ 🎁
      </MotionDiv>
    </MotionDiv>
  )
}

export default Testimonial
