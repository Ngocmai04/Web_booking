import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import ListRoom from './pages/hotelOwner/ListRoom'
import EditRoom from './pages/hotelOwner/EditRoom'
import AddHotel from './pages/hotelOwner/AddHotel'
import EditHotel from './pages/hotelOwner/EditHotel'
import ListHotel from './pages/hotelOwner/ListHotel'
import HotelReg from './components/HotelReg'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'
import Loader from './components/Loader'
import SnowFalling from './components/SnowFalling'
import ReindeerCursor from './components/ReindeerCursor'
import FlyingSanta from './components/FlyingSanta'

// Admin imports
import AdminLayout from "./pages/admin/Layout";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageHotels from "./pages/admin/ManageHotels";
import PendingHotels from "./pages/admin/PendingHotels";
import ManageRooms from "./pages/admin/ManageRooms";
import ManageBookings from "./pages/admin/ManageBookings";

const App = () => {
  // Check Is Route Starts With Owner or Admin
  const isOwnerPath = useLocation().pathname.includes("owner");
  const isAdminPath = useLocation().pathname.includes("admin");
  const { showHotelReg } = useAppContext();

  // Prevent horizontal scroll
  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  return (
    <div
      className="font-inter min-h-screen relative overflow-x-hidden"
      style={{
        // 🎄 Warm Christmas Background
        background: !isOwnerPath && !isAdminPath
          ? "linear-gradient(180deg, #FEF3E2 0%, #FFE5CC 50%, #FFF8F0 100%)"
          : "white",
        transition: "0.3s ease",
      }}
    >
      <Toaster />

      {/* 🎄 Warm Christmas Decorations */}
      {!isOwnerPath && !isAdminPath && (
        <>
          {/* 🎅 Flying Santa Effect - Thêm ở đây */}
          <FlyingSanta />

          {/* 🎄 Christmas Lights - Full Width */}
          <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-green-400 via-yellow-300 via-red-400 to-green-400 opacity-70 animate-pulse shadow-lg z-[100]" />

          {/* ❄️ Gentle Snowflakes - Always Falling */}
          <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <div
                key={`snow-${i}`}
                className="absolute text-white animate-snow-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                  animationDuration: `${8 + Math.random() * 12}s`,
                  animationDelay: `${Math.random() * 8}s`,
                  fontSize: `${10 + Math.random() * 14}px`,
                  opacity: 0.5 + Math.random() * 0.4,
                }}
              >
                ❄
              </div>
            ))}
          </div>

          {/* ❄️ Snow Effect Component */}
          <SnowFalling />

          {/* 🦌 Reindeer Cursor */}
          <ReindeerCursor />

          {/* 🎄 Warm Glow Effects */}
          <div
            style={{
              position: "fixed",
              top: -100,
              left: -100,
              width: 350,
              height: 350,
              background: "radial-gradient(circle, rgba(255, 230, 200, 0.3) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(80px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "20%",
              right: -80,
              width: 300,
              height: 300,
              background: "radial-gradient(circle, rgba(255, 200, 180, 0.25) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(90px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: "fixed",
              bottom: -120,
              left: "30%",
              width: 400,
              height: 400,
              background: "radial-gradient(circle, rgba(255, 240, 220, 0.3) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(100px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </>
      )}

      {!isOwnerPath && !isAdminPath && <Navbar />}
      {showHotelReg && <HotelReg />}

      {/* Main Content */}
      <div className='min-h-[70vh] relative z-[10]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="/loader/:nextUrl" element={<Loader />} />

          {/* Owner routes */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="hotels" element={<ListHotel />} />
            <Route path="add-hotel" element={<AddHotel />} />
            <Route path="edit-hotel/:id" element={<EditHotel />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="edit-room/:roomId" element={<EditRoom />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="hotels" element={<ManageHotels />} />
            <Route path="pending-hotels" element={<PendingHotels />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="bookings" element={<ManageBookings />} />
          </Route>
        </Routes>
      </div>

      {!isOwnerPath && !isAdminPath && <Footer />}

      {/* Snow Fall Animation */}
      <style>{`
        @keyframes snow-fall {
          0% { 
            transform: translateY(0) translateX(0) rotate(0deg); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg); 
            opacity: 0; 
          }
        }
        .animate-snow-fall {
          animation: snow-fall linear infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

export default App;