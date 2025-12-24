import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { 
      icon: "fa-chart-line", 
      label: "Dashboard", 
      path: "/admin",
      hoverIcon: "fa-candy-cane"
    },
    { 
      icon: "fa-users", 
      label: "Manage Users", 
      path: "/admin/users",
      hoverIcon: "fa-snowman"
    },
    { 
      icon: "fa-hotel", 
      label: "Manage Hotels", 
      path: "/admin/hotels",
      hoverIcon: "fa-gift"
    },
    { 
      icon: "fa-door-open", 
      label: "Manage Rooms", 
      path: "/admin/rooms",
      hoverIcon: "fa-tree"
    },
    { 
      icon: "fa-calendar-check", 
      label: "Manage Bookings", 
      path: "/admin/bookings",
      hoverIcon: "fa-star"
    },
  ];

  return (
    <div className="w-64 h-full bg-gradient-to-b from-red-700 via-red-800 to-green-800 shadow-2xl relative overflow-hidden border-r-4 border-yellow-400">
      {/* Animated snowflakes decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-4 text-white text-lg animate-snow-fall">❄</div>
        <div className="absolute top-20 right-6 text-white text-sm animate-snow-fall-delayed">❄</div>
        <div className="absolute top-40 left-8 text-white text-base animate-snow-fall-slow">❄</div>
        <div className="absolute top-64 right-4 text-white text-lg animate-snow-fall">❄</div>
        <div className="absolute bottom-32 left-6 text-white text-base animate-snow-fall-delayed">❄</div>
        <div className="absolute bottom-16 right-8 text-white text-sm animate-snow-fall-slow">❄</div>
      </div>

      <div className="p-6 relative z-10 h-full overflow-y-auto">
        {/* Christmas Tree Header */}
        <div className="mb-6 text-center">
          <svg className="w-16 h-16 mx-auto mb-2 text-yellow-300 hover:scale-110 transform transition-all duration-300 cursor-pointer animate-pulse-slow" 
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 14h14L10 2z"/>
            <rect x="8" y="14" width="4" height="4" fill="#8B4513"/>
          </svg>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-yellow-300 text-base font-bold mb-1 flex items-center justify-center gap-2">
              <i className="fas fa-holly-berry"></i>
              Christmas Edition
            </p>
            <p className="text-white text-xs opacity-80 flex items-center justify-center gap-1">
              Season's Greetings!
              <i className="fas fa-sleigh text-yellow-300"></i>
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-3 mb-6">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-white font-medium
                 bg-white/10 backdrop-blur-sm border-2 transition-all duration-300 ease-out
                 transform group relative overflow-hidden
                 ${isActive 
                   ? 'bg-gradient-to-r from-red-500 to-green-500 border-yellow-300 scale-105 shadow-xl' 
                   : 'border-white/20 hover:bg-gradient-to-r hover:from-red-500 hover:to-green-500 hover:scale-105 hover:shadow-xl hover:border-yellow-300'
                 }
                 active:scale-95`
              }
            >
              {/* Sparkle effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <i className={`fas ${item.icon} text-xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10`}></i>
              
              <span className="group-hover:translate-x-1 transition-transform duration-300 relative z-10 text-sm">
                {item.label}
              </span>
              
              <i className={`fas ${item.hoverIcon} ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10
                             group-hover:rotate-12 text-lg text-yellow-300`}></i>
            </NavLink>
          ))}
        </nav>

        {/* Decorative Divider */}
        <div className="my-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <svg className="w-6 h-6 text-yellow-300 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V4a.5.5 0 01.5-.5zm0 9a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zm6-6a.5.5 0 010 .707l-1.414 1.414a.5.5 0 11-.707-.707L15.293 7a.5.5 0 01.707 0zM7.121 14.879a.5.5 0 010 .707l-1.414 1.414a.5.5 0 11-.707-.707l1.414-1.414a.5.5 0 01.707 0zM16.5 10a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM7 10a.5.5 0 01-.5.5H4a.5.5 0 010-1h2.5A.5.5 0 017 10zm9.879 4.879a.5.5 0 01-.707 0l-1.414-1.414a.5.5 0 11.707-.707l1.414 1.414a.5.5 0 010 .707zM7.121 5.121a.5.5 0 01-.707 0L4.707 3.707a.5.5 0 11.707-.707l1.707 1.707a.5.5 0 010 .707z"/>
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Christmas Quote Card */}
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 
                      hover:bg-white/20 hover:border-yellow-300 hover:scale-105 hover:shadow-xl
                      transform transition-all duration-300 group cursor-pointer">
          <div className="flex justify-center mb-2">
            <svg className="w-10 h-10 text-red-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
            </svg>
          </div>
          <p className="text-white text-xs text-center leading-relaxed">
            "Christmas waves a magic wand over this world, and behold, everything is softer and more beautiful."
          </p>
          <p className="text-yellow-300 text-xs text-center mt-2 font-semibold flex items-center justify-center gap-1">
            <i className="fas fa-quote-left text-xs"></i>
            Norman Vincent Peale
          </p>
        </div>

        {/* Stats Mini Card */}
        <div className="mt-4 p-4 bg-gradient-to-r from-green-600/50 to-red-600/50 backdrop-blur-sm rounded-xl border-2 border-white/30
                      hover:scale-105 hover:shadow-xl transform transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium flex items-center gap-2">
              <i className="fas fa-calendar-day"></i>
              Days to Christmas
            </span>
            <svg className="w-8 h-8 text-yellow-300 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="text-3xl font-bold text-yellow-300 text-center group-hover:scale-110 transition-transform flex items-center justify-center gap-2">
            <i className="fas fa-gift text-2xl"></i>
            {Math.ceil((new Date('2025-12-25') - new Date()) / (1000 * 60 * 60 * 24))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes snow-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes snow-fall-delayed {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(-360deg); opacity: 0; }
        }
        @keyframes snow-fall-slow {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(180deg); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-snow-fall {
          animation: snow-fall 10s linear infinite;
        }
        .animate-snow-fall-delayed {
          animation: snow-fall-delayed 12s linear infinite;
          animation-delay: 2s;
        }
        .animate-snow-fall-slow {
          animation: snow-fall-slow 15s linear infinite;
          animation-delay: 1s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>

      {/* FontAwesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default Sidebar;