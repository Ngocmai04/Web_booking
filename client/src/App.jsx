import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";
import AddHotel from "./pages/hotelOwner/AddHotel";
import EditHotel from "./pages/hotelOwner/EditHotel";
import ListHotel from "./pages/hotelOwner/ListHotel";
import HotelReg from "./components/HotelReg";
import { useAppContext } from "./context/AppContext";
import { Toaster } from "react-hot-toast";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import Footer from "./components/Footer";
import MyBookings from "./pages/MyBookings";
import Loader from "./components/Loader";
import SnowFalling from "./components/SnowFalling";

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

  return (
    <div
      className="font-inter min-h-screen relative"
      style={{
        // ❄️ Background Giáng Sinh (không áp dụng cho owner và admin)
        background:
          !isOwnerPath && !isAdminPath
            ? "linear-gradient(180deg, #b71c1c 0%, #880e4f 100%)"
            : "white",
        color: !isOwnerPath && !isAdminPath ? "white" : "black",
        transition: "0.3s ease",
      }}
    >
      <Toaster />

      {/* ❄️ Tuyết rơi toàn trang (chỉ user, không owner/admin) */}
      {!isOwnerPath && !isAdminPath && <SnowFalling />}

      {/* 🎄 Vầng sáng đỏ ở góc trái trên */}
      {!isOwnerPath && !isAdminPath && (
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 250,
            height: 250,
            background: "rgba(255, 255, 255, 0.18)",
            borderRadius: "50%",
            filter: "blur(90px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* 🎄 Vầng sáng xanh lá ở góc phải dưới */}
      {!isOwnerPath && !isAdminPath && (
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -60,
            width: 300,
            height: 300,
            background: "rgba(0, 255, 170, 0.15)",
            borderRadius: "50%",
            filter: "blur(110px)",
            pointerEvents: "none",
          }}
        />
      )}

      {!isOwnerPath && !isAdminPath && <Navbar />}
      {showHotelReg && <HotelReg />}

      {/* Nội dung chính */}
      <div className="min-h-[70vh] relative z-[10]">
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
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
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
    </div>
  );
};

export default App;
