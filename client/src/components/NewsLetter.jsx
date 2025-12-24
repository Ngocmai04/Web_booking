import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const NewsLetter = () => {
  return (
    <motion.div
      className="flex flex-col items-center max-w-5xl lg:w-full rounded-3xl px-6 py-16 mx-2 lg:mx-auto my-30 bg-gradient-to-br from-red-900 via-red-800 to-green-900 text-white shadow-2xl border-4 border-yellow-400/30 relative overflow-hidden"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Decorative Christmas elements */}
      <motion.div className="absolute top-6 left-6 text-4xl opacity-20" variants={item}>
        🎄
      </motion.div>
      <motion.div className="absolute bottom-6 right-6 text-4xl opacity-20" variants={item}>
        ❄️
      </motion.div>
      <motion.div className="absolute top-1/2 left-1/4 text-3xl opacity-10" variants={item}>
        ⭐
      </motion.div>
      <motion.div className="absolute top-1/3 right-1/4 text-3xl opacity-10" variants={item}>
        🎁
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center w-full"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div className="text-4xl mb-4" variants={item}>
          🎅
        </motion.div>

        {/* Title */}
        <motion.div className="text-center mb-8" variants={item}>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-4">
            Stay Inspired This Christmas
          </h2>
          <p className="text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Join our newsletter and be the first to discover new holiday destinations, exclusive festive offers, and seasonal travel inspiration.
          </p>
        </motion.div>

        {/* Input + Button */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 w-full max-w-2xl"
          variants={item}
        >
          <input
            type="email"
            className="bg-white px-5 py-3.5 border-2 border-gray-300 rounded-xl outline-none w-full text-gray-800 placeholder:text-gray-500 focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all"
            placeholder="Enter your email"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 group bg-white text-red-700 px-6 md:px-8 py-3.5 rounded-xl font-bold hover:bg-red-50 transition-all shadow-lg whitespace-nowrap"
          >
            Subscribe
            <motion.img
              src={assets.arrowIcon}
              alt="arrow-icon"
              className="w-3.5"
              whileHover={{ x: 5 }}
            />
          </motion.button>
        </motion.div>

        <motion.p
          className="text-white/90 mt-6 text-xs text-center max-w-md"
          variants={item}
        >
          By subscribing, you agree to our Privacy Policy and consent to receive holiday updates and special offers.
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default NewsLetter
