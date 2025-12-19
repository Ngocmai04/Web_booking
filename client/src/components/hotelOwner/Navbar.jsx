import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBell, faGift, 
  faHome, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { UserButton, useUser, useClerk } from '@clerk/clerk-react'

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

// Christmas Bell Icon
const ChristmasBell = () => (
  <svg
    className="w-5 h-5 text-yellow-300 animate-swing"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2a2 2 0 0 1 2 2v.5a7.5 7.5 0 0 1 7.5 7.5v3.5a3 3 0 0 0 .5 1.667V18H2v-1.333A3 3 0 0 0 2.5 15v-3.5A7.5 7.5 0 0 1 10 4V4a2 2 0 0 1 2-2zm-2 18h4a2 2 0 1 1-4 0z" />
  </svg>
);

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
  
  const { logout } = useAppContext()
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut, openSignIn } = useClerk()

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

  const handleLogout = async () => {
    try {
      await signOut()
      if (logout) logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

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
          z-index: 1;
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
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="snowflake text-lg"
            style={{
              left: `${10 + i * 20}%`,
              animationDuration: `${6 + i * 1.5}s`,
              animationDelay: `${i * 0.1}s`,
              fontSize: `${12 + i * 2}px`,
            }}
          >
            ❄
          </div>
        ))}
        
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between relative z-10">
          {/* Left Section - Logo & Home Button */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/owner" className="group animate-float">
              <div className="flex items-center space-x-6"> 
                <div className="relative translate-y-2">
                  <img
                        src={assets.logo}
                        alt="logo"
                        className={`h-10 transition-all duration-300 ${
                          isScrolled
                            ? "filter brightness-100 drop-shadow-[0_0_15px_rgba(255,215,0,1)]"
                            : "drop-shadow-[0_0_12px_white]"
                        }`}
                      />
                      {!isScrolled && <Snowflake />}
                      {isScrolled && <ChristmasBell />}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-white font-bold text-2xl group-hover:text-yellow-300 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    Hotel Dashboard
                  </span>
                  <span className="text-yellow-200 text-sm flex items-center">
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
          <div className="flex items-center space-x-3 md:space-x-4 relative z-20">
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

            {/* Right Section - Desktop - ÁP DỤNG TỪ NAVBAR */}
            <div className="hidden md:flex items-center gap-3 relative z-10">
              {isLoaded && clerkUser ?  (
                <>
                  {/* Clerk UserButton (Avatar) */}
                  <div className="ring-2 ring-yellow-400 rounded-full ring-offset-2 ring-offset-transparent p-0.5 w-10 h-10 flex items-center justify-center overflow-hidden">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "!w-12 !h-12",
                          userButtonImage: "!w-full !h-full",
                          userButtonTrigger:
                            "!p-0 !border-none !shadow-none focus:!shadow-none",
                        },
                      }}
                    />
                  </div>
                  
                  {/* User Info (Name) */}
                  <div className="flex flex-col items-start">
                    <p className="text-white font-semibold text-sm drop-shadow-md">
                      {clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}` || clerkUser.username}
                    </p>
                    <p className="text-yellow-200 text-xs">Welcome back! 🎄</p>
                  </div>
                </>
              ) : (
                <button
                  onClick={openSignIn}
                  className="bg-gradient-to-r from-red-600 to-green-600 text-white px-8 py-2.5 rounded-full shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-green-500/50 transition-all font-bold hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10">🎅 Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
              )}
            </div>

            {/* Mobile Menu Button - ÁP DỤNG TỪ NAVBAR */}
            <div className="flex items-center gap-3 md:hidden relative z-10">
              {isLoaded && clerkUser && (
                <>
                  {/* Clerk UserButton (Avatar) */}
                  <div className="ring-2 ring-yellow-400 rounded-full ring-offset-2 ring-offset-transparent p-0.5 w-10 h-10 flex items-center justify-center overflow-hidden">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "!w-12 !h-12",
                          userButtonImage: "!w-full !h-full",
                          userButtonTrigger:
                            "!p-0 !border-none !shadow-none focus:!shadow-none",
                        },
                      }}
                    />
                  </div>
                  
                  {/* User Info (Name) */}
                  <div className="flex flex-col items-start">
                    <p className="text-white font-semibold text-xs drop-shadow-md">
                      {clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`}
                    </p>
                  </div>
                </>
              )}
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
          className="absolute top-4 right-4 text-white hover:text-yellow-300 hover:scale-110 transition-transform z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* User Info with Clerk UserButton */}
        {isLoaded && clerkUser && (
          <div className="flex flex-col items-center gap-3 mb-4 z-30">
            {/* Avatar */}
            <div className="ring-2 ring-yellow-400 rounded-full ring-offset-2 ring-offset-red-800 p-0.5">
              <img
                src={clerkUser.imageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            
            {/* Name */}
            <p className="text-xl text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}` || clerkUser.username || 'Hotel Owner'}
            </p>
            <p className="text-yellow-200 text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">🎅 Premium Host</p>
          </div>
        )}

        {/* Mobile Navigation */}
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-2xl hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-white flex items-center gap-2 z-30"
        >
          <FontAwesomeIcon icon={faHome} />
          Go to Home 🏠
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(false)
            handleLogout()
          }}
          className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg hover:scale-105 transition-all flex items-center gap-2 z-30"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
      </div>
    </>
  )
}

export default OwnerNavbar