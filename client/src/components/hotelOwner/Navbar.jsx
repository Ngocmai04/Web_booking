import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBell, faGift, 
  faHome, faUser, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

// Animated Snowflake Component
const Snowflake = () => (
  <svg
    className="w-4 h-4 text-white animate-spin-slow drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v18m9-9H3m15.364-6.364L5.636 18.364m13.728 0L5.636 5.636"
    />
  </svg>
)

// Christmas Lights Component
const ChristmasLights = () => (
  <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
    <div className="flex animate-lights w-full justify-between">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full mx-3 ${
            i % 4 === 0
              ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
              : i % 4 === 1
              ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
              : i % 4 === 2
              ? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
              : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          }`}
          style={{
            animation: `twinkle ${1 + (i % 3) * 0.5}s infinite ${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
)

const OwnerNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const { user, logout, navigate } = useAppContext()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const notifications = [
    { id: 1, message: "New booking received!", time: "5 min ago", read: false },
    { id: 2, message: "Room 304 booked for Christmas", time: "1 hour ago", read: true },
    { id: 3, message: "Payment received for Suite 101", time: "2 hours ago", read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes lights {
          0% { transform: translateX(0); }
          100% { transform: translateX(-200px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes snow-fall {
          0% { transform: translateY(-10px) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) translateX(100px); opacity: 0; }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-swing {
          animation: swing 1s ease-in-out infinite;
          transform-origin: top center;
        }
        .animate-lights {
          animation: lights 10s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .snowflake {
          position: absolute;
          color: white;
          animation: snow-fall linear infinite;
          pointer-events: none;
        }
      `}</style>

      <nav className={`
        sticky top-0 z-50 transition-all duration-500 
        ${isScrolled 
          ? 'bg-gradient-to-r from-red-700/95 via-green-700/95 to-red-700/95 backdrop-blur-lg shadow-2xl py-3 border-b-2 border-yellow-400' 
          : 'bg-gradient-to-r from-red-800 via-green-800 to-red-800 py-4'
        }
      `}>
        {/* Christmas Lights */}
        <ChristmasLights />
        
        {/* Falling Snowflakes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="snowflake text-xl"
            style={{
              left: `${i * 15 + 10}%`,
              animationDuration: `${10 + i * 2}s`,
              animationDelay: `${i * 0.7}s`,
              fontSize: `${12 + i * 2}px`,
            }}
          >
            ❄
          </div>
        ))}
        
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between relative z-10">
          {/* Left Section - Logo & Home Button */}
          <div className="flex items-center gap-4">
            <Link to="/owner" className="group animate-float">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={assets.logo} 
                    alt="Logo" 
                    className="h-10 w-10 object-contain filter brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,1)] group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute -top-1 -right-1 text-yellow-300 animate-swing text-sm">
                    🎄
                  </div>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-white font-bold text-xl group-hover:text-yellow-300 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    Hotel Dashboard
                  </span>
                  <span className="text-yellow-200 text-xs flex items-center">
                    <Snowflake />
                    <span className="ml-1">Christmas Special</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Home Button */}
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-yellow-400 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-all group"
              >
                <FontAwesomeIcon 
                  icon={faBell} 
                  className="text-white text-lg md:text-xl group-hover:text-yellow-300 transition-colors animate-swing"
                />
                {unreadCount > 0 && (
                  <>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {unreadCount}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping"></div>
                  </>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-red-900 to-green-900 rounded-xl shadow-2xl border-2 border-yellow-400 overflow-hidden backdrop-blur-lg z-50">
                  <div className="p-4 border-b border-white/20">
                    <h3 className="text-white font-bold flex items-center">
                      <FontAwesomeIcon icon={faBell} className="mr-2 text-yellow-300" />
                      Notifications
                      <span className="ml-auto text-yellow-300 text-sm bg-red-600 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-red-900/30' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            <FontAwesomeIcon 
                              icon={faGift} 
                              className={`text-sm ${notif.read ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{notif.message}</p>
                            <p className="text-white/60 text-sm mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-black/20">
                    <button className="text-center w-full text-yellow-300 hover:text-yellow-400 transition-colors font-semibold">
                      View all notifications 🎁
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile - Desktop */}
            <div className="hidden md:block relative group">
              <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                <div className="relative">
                  <img 
                    src={user?.imageUrl || 'https://placehold.co/40'} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-yellow-400 object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-red-800 shadow-md"></div>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm drop-shadow-md">
                    {user?.fullName || 'Hotel Owner'}
                  </p>
                  <p className="text-yellow-200 text-xs">🎅 Premium Host</p>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-red-900 to-green-900 rounded-xl shadow-2xl border-2 border-yellow-400 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-lg">
                <div className="p-4 border-b border-white/20">
                  <p className="text-white font-bold">{user?.fullName}</p>
                  <p className="text-yellow-200 text-sm">Hotel Owner 🏨</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/owner/profile"
                    className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-3 text-yellow-300" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center w-full px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors mt-1"
                  >
                    <FontAwesomeIcon icon={faHome} className="mr-3 text-green-300" />
                    Go to Home
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2 text-red-300 hover:bg-white/10 rounded-lg transition-colors mt-1"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-yellow-300 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 z-50 w-full h-screen bg-gradient-to-br from-red-600/95 via-green-600/95 to-red-600/95 backdrop-blur-xl flex flex-col items-center justify-center gap-4 font-bold text-white transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-yellow-300 hover:scale-110 transition-transform"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <img 
            src={user?.imageUrl || 'https://placehold.co/80'} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border-4 border-yellow-400 object-cover shadow-2xl"
          />
          <p className="text-xl text-white font-bold drop-shadow-lg">
            {user?.fullName || 'Hotel Owner'}
          </p>
          <p className="text-yellow-200 text-sm">🎅 Premium Host</p>
        </div>

        {/* Mobile Navigation */}
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-2xl hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faHome} />
          Go to Home 🏠
        </Link>

        <Link
          to="/owner/profile"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-2xl hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faUser} />
          My Profile 👤
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(false)
            logout()
          }}
          className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
      </div>
    </>
  )
}

export default OwnerNavbar