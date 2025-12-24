import React, { useEffect } from "react";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { isAdmin, navigate, loading } = useAppContext();

  useEffect(() => {
    if (loading) return;

    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-green-50 to-white">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-200 border-t-red-600"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
            🎄
          </div>
        </div>
        <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-red-50 via-green-50 to-white relative overflow-hidden">
      {/* Animated Christmas decorations background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-20 left-1/4 text-red-400 text-3xl animate-float">❄</div>
        <div className="absolute top-40 right-1/4 text-green-400 text-2xl animate-float-delayed">❄</div>
        <div className="absolute top-60 left-1/3 text-red-400 text-4xl animate-float-slow">⭐</div>
        <div className="absolute bottom-40 right-1/3 text-green-400 text-3xl animate-float">🎁</div>
        <div className="absolute bottom-20 left-1/2 text-red-400 text-2xl animate-float-delayed">🔔</div>
        <div className="absolute top-1/3 right-1/4 text-yellow-400 text-2xl animate-float-slow">✨</div>
      </div>

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Content Area with Sidebar and Content */}
      <div className="flex flex-1 pt-20 relative z-10 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-20 bottom-0 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 ml-64 p-4 md:p-6 lg:p-10 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-25px) rotate(10deg); 
            opacity: 0.6;
          }
        }
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-35px) rotate(-10deg); 
            opacity: 0.7;
          }
        }
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) scale(1) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) scale(1.15) rotate(5deg); 
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        /* Custom Scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #dc2626, #16a34a);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #b91c1c, #15803d);
        }
      `}</style>
    </div>
  );
};

export default Layout;