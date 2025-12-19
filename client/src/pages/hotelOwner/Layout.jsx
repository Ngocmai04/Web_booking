import React, { useEffect } from 'react'
import OwnerNavbar from '../../components/hotelOwner/OwnerNavbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { isOwner, navigate } = useAppContext()

  useEffect(() => {
    if (!isOwner) {
      navigate('/')
    }
  }, [isOwner, navigate])

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-950 via-green-950 to-red-900 overflow-hidden relative'>
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Large Snowflakes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`snow-big-${i}`}
            className="absolute text-white/20 animate-snow-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`,
              fontSize: `${15 + Math.random() * 20}px`,
            }}
          >
            ❄
          </div>
        ))}
        
        {/* Small Sparkles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300/15 animate-snow-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${5 + Math.random() * 10}px`,
            }}
          >
            ✨
          </div>
        ))}
        
        {/* Floating Gifts - Fewer and More Subtle */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`gift-${i}`}
            className="absolute animate-float-gentle opacity-20"
            style={{
              left: `${15 + i * 35}%`,
              top: `${20 + i * 25}%`,
              animationDuration: `${14 + i * 3}s`,
              animationDelay: `${i * 2}s`,
              fontSize: `${20 + i * 5}px`,
            }}
          >
            🎁
          </div>
        ))}
        
        {/* Twinkling Lights - More Subtle */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400/40 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <style>{`
        @keyframes snow-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(120deg); }
          66% { transform: translateY(8px) rotate(240deg); }
        }
        @keyframes glow-border {
          0%, 100% { 
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 0.3),
              0 0 40px rgba(34, 197, 94, 0.2),
              inset 0 0 30px rgba(255, 255, 255, 0.05);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(239, 68, 68, 0.5),
              0 0 60px rgba(34, 197, 94, 0.4),
              inset 0 0 40px rgba(255, 255, 255, 0.08);
          }
        }
        .animate-glow-border {
          animation: glow-border 3s ease-in-out infinite;
        }
        .animate-snow-fall {
          animation: snow-fall linear infinite;
        }
        .animate-float-gentle {
          animation: float-gentle ease-in-out infinite;
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(220, 38, 38, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #dc2626, #16a34a);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #b91c1c, #15803d);
        }
      `}</style>

      {/* Main Layout */}
      <div className="relative z-10">
        <OwnerNavbar />
        
        <div className='flex'>
          {/* Sidebar */}
          <div className="relative flex-shrink-0">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <div className='flex-1 overflow-y-auto custom-scrollbar'>
            <div className='min-h-[calc(100vh-80px)] p-4 md:p-6'>
              {/* Main Content Container with Christmas Theme */}
              <div className='relative'>
                {/* Outer Glow Effect - Subtle */}
                <div className="absolute -inset-2 bg-gradient-to-br from-red-500/5 via-green-500/5 to-yellow-500/5 rounded-3xl blur-2xl"></div>
                
                {/* Main Content Box - High Contrast White Background */}
                <div className="relative bg-white rounded-3xl border-4 border-red-200/60 shadow-2xl animate-glow-border overflow-hidden">
                  {/* Inner White Overlay for Maximum Text Contrast */}
                  <div className="absolute inset-0 bg-white/98"></div>
                  
                  {/* Christmas Corner Decorations - Smaller and More Subtle */}
                  <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-red-500 to-green-500 rounded-br-2xl animate-pulse border-r-2 border-b-2 border-yellow-400"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-yellow-400 to-red-500 rounded-bl-2xl animate-pulse border-l-2 border-b-2 border-green-400" style={{animationDelay: '0.3s'}}></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-green-500 to-blue-500 rounded-tr-2xl animate-pulse border-r-2 border-t-2 border-red-400" style={{animationDelay: '0.6s'}}></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-red-500 to-yellow-400 rounded-tl-2xl animate-pulse border-l-2 border-t-2 border-green-400" style={{animationDelay: '0.9s'}}></div>
                  
                  {/* Content Wrapper with Padding and Dark Text */}
                  <div className="relative z-10 p-6 md:p-8 text-gray-900">
                    <Outlet />
                  </div>
                  
                  {/* Subtle Top Border Gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-red-500 opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements - More Subtle and Positioned Better */}
      <div className="fixed top-28 left-8 text-4xl text-green-400/20 animate-float-gentle pointer-events-none z-5 hidden xl:block">
        🎄
      </div>
      <div className="fixed bottom-28 right-8 text-3xl text-red-400/20 animate-float-gentle pointer-events-none z-5 hidden xl:block" style={{animationDelay: '1s', animationDuration: '9s'}}>
        ⭐
      </div>
      <div className="fixed top-1/2 right-12 text-2xl text-yellow-300/15 animate-float-gentle pointer-events-none z-5 hidden 2xl:block" style={{animationDelay: '2s', animationDuration: '11s'}}>
        🔔
      </div>
    </div>
  )
}

export default Layout