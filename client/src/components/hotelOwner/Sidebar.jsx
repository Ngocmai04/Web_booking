import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faHotel,
  faBed,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faSnowflake,
} from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const menuItems = [
    { path: '/owner', icon: faHome, label: 'Dashboard', emoji: '🎄' },
    { 
      path: '/owner/hotels', 
      icon: faHotel, 
      label: 'My Hotels', 
      emoji: '🏨',
      subtext: 'Manage hotels'
    },
    { 
      path: '/owner/list-room', 
      icon: faBed, 
      label: 'My Rooms', 
      emoji: '🛏️',
      subtext: 'View all rooms'
    },
    { 
      path: '/owner/add-room', 
      icon: faPlus, 
      label: 'Add Room', 
      emoji: '🎁',
      subtext: 'Create listing'
    },
  ]

  return (
    <>
      <style>{`
        @keyframes snowflake-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(34, 197, 94, 0.2); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(34, 197, 94, 0.4); }
        }
        .animate-snowflake-rotate {
          animation: snowflake-rotate 10s linear infinite;
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <aside
        className={`
          sticky top-20 h-[calc(100vh-5rem)] 
          bg-gradient-to-b from-red-900/95 via-green-900/95 to-red-900/95 
          backdrop-blur-lg border-r-4 border-yellow-400/50
          shadow-2xl transition-all duration-500 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          animate-glow-pulse
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-6 w-8 h-8 bg-gradient-to-br from-red-600 to-green-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center text-white border-2 border-yellow-400 z-10"
        >
          <FontAwesomeIcon
            icon={isCollapsed ? faChevronRight : faChevronLeft}
            className="text-sm"
          />
        </button>

        {/* Sidebar Header */}
        <div className="p-6 border-b-2 border-yellow-400/30">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSnowflake}
                className="text-white text-3xl animate-snowflake-rotate drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              />
              <div className="absolute -top-1 -right-1 text-yellow-300 text-xs">
                🎄
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h2 className="text-white font-bold text-xl drop-shadow-lg">
                  Owner Panel
                </h2>
                <p className="text-yellow-200 text-xs flex items-center gap-1">
                  <span>🎅</span>
                  <span>Christmas Edition</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-120px)] scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-green-900">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group relative flex items-center gap-4 p-3 rounded-xl
                  transition-all duration-300 overflow-hidden
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                  }
                `}
              >
                {/* Background Glow Effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 animate-pulse"></div>
                )}

                {/* Icon */}
                <div className={`relative z-10 ${isCollapsed ? 'mx-auto' : ''}`}>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-lg ${
                      isActive
                        ? 'text-yellow-300 drop-shadow-lg'
                        : 'text-white/90 group-hover:text-yellow-300'
                    } transition-colors`}
                  />
                </div>

                {/* Label */}
                {!isCollapsed && (
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold drop-shadow-md">
                        {item.label}
                      </span>
                      <span className="text-lg">{item.emoji}</span>
                    </div>
                    {item.subtext && (
                      <p className="text-xs text-white/60 mt-0.5">{item.subtext}</p>
                    )}
                  </div>
                )}

                {/* Active Indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-yellow-400 rounded-l-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gradient-to-r from-red-800 to-green-800 text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-xl border-2 border-yellow-400 z-50">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2 font-bold">
                        {item.label}
                        <span>{item.emoji}</span>
                      </span>
                      {item.subtext && (
                        <span className="text-xs text-yellow-200 mt-1">{item.subtext}</span>
                      )}
                    </div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-red-800 rotate-45 border-l-2 border-b-2 border-yellow-400"></div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Decoration */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-yellow-400/30 bg-gradient-to-t from-black/20 to-transparent">
          {!isCollapsed ? (
            <div className="flex items-center justify-center gap-2 text-yellow-200 text-sm">
              <FontAwesomeIcon icon={faSnowflake} className="animate-spin-slow text-xs" />
              <span className="drop-shadow-md">Merry Christmas! 🎄</span>
              <FontAwesomeIcon icon={faSnowflake} className="animate-spin-slow text-xs" />
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-2xl animate-bounce">🎁</span>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 -right-2 text-2xl text-yellow-300/30 animate-bounce pointer-events-none">
          ⭐
        </div>
        <div className="absolute bottom-1/4 -right-2 text-2xl text-red-300/30 animate-bounce pointer-events-none" style={{animationDelay: '0.5s'}}>
          🔔
        </div>
      </aside>
    </>
  )
}

export default Sidebar