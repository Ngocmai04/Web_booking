import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
// 1. Import các hook của Clerk
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';

const Navbar = () => {
  const { logout, axios, getToken } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // 2. Lấy thông tin user từ Clerk
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setNotifications(data.notifications);
        setNotificationCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [axios, getToken]);

  // Fetch notifications on mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Hàm xử lý đăng xuất (kết hợp cả Clerk và AppContext)
  const handleLogout = async () => {
    try {
      await signOut(); // Đăng xuất khỏi Clerk
      if (logout) logout(); // Xóa state của App (nếu có)
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showNotifications && !e.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        h-20 md:h-24
        border-b-4 border-yellow-400
        transition-all duration-300
        ${
          scrolled
            ? "bg-gradient-to-r from-red-700/80 via-green-700/80 to-red-700/80 backdrop-blur-xl shadow-2xl"
            : "bg-gradient-to-r from-red-600 via-green-600 to-red-600 shadow-lg"
        }
      `}
    >
      {/* Decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-4 left-10 text-white text-2xl animate-pulse">
          ❄
        </div>
        <div className="absolute top-6 left-32 text-yellow-300 text-xl animate-pulse delay-100">
          ⛄
        </div>
        <div className="absolute top-4 right-20 text-white text-2xl animate-pulse delay-200">
          🎄
        </div>
        <div className="absolute top-6 right-48 text-yellow-300 text-xl animate-pulse delay-300">
          ⭐
        </div>
      </div>

      <div className="flex items-center justify-between h-full px-6 relative z-10">
        
        {/* --- LEFT SIDE: Logo & Home Button --- */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-4xl group-hover:rotate-12 group-hover:scale-110 transition-all">
              🎅
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Admin Dashboard
                <span className="text-yellow-300 text-sm animate-bounce">✨</span>
              </h1>
              <p className="text-xs text-white/80">Merry Christmas Edition 🎄</p>
            </div>
          </div>

          {/* Home Button */}
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white
             hover:bg-green-500 hover:scale-105 hover:shadow-lg transition flex items-center gap-2 font-bold shadow-sm"
          >
            🏠 Home
          </Link>
        </div>


        {/* --- RIGHT SIDE: Bell, User, Logout --- */}
        <div className="flex items-center gap-4">
          {/* Bell with Notifications Dropdown */}
          <div className="relative notification-dropdown">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-white/20 backdrop-blur border border-white/30
              hover:scale-110 hover:bg-white/30 transition"
            >
              🔔
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border-2 border-red-200 overflow-hidden z-50">
                <div className="bg-gradient-to-r from-red-500 to-green-500 px-4 py-3">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    🎄 Thông báo đặt phòng mới
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <span className="text-4xl">🎅</span>
                      <p className="mt-2">Chưa có đặt phòng mới</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="p-4 border-b border-gray-100 hover:bg-green-50 transition cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-green-400 flex items-center justify-center text-white font-bold">
                            {notification.user?.username?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {notification.user?.username || 'Khách'}
                              <span className="font-normal text-gray-600"> đã đặt phòng</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              🏨 {notification.hotel?.name || 'Hotel'} - {notification.room?.roomType || 'Room'}
                            </p>
                            <p className="text-sm text-green-600 font-semibold">
                              💰 ${notification.totalPrice}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              ⏰ {timeAgo(notification.createdAt)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            notification.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : notification.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {notification.status === 'confirmed' ? '✓ Confirmed' : 
                             notification.status === 'cancelled' ? '✗ Cancelled' : '⏳ Pending'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/admin/bookings"
                  onClick={() => setShowNotifications(false)}
                  className="block text-center py-3 bg-gradient-to-r from-red-50 to-green-50 text-red-600 font-semibold hover:from-red-100 hover:to-green-100 transition"
                >
                  Xem tất cả đặt phòng →
                </Link>
              </div>
            )}
          </div>

          {/* User Info & Clerk Avatar */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30
            hover:scale-105 transition cursor-pointer">
            
            {/* 3. Thay thế thẻ img bằng UserButton của Clerk */}
            {isLoaded && clerkUser ? (
                <div className="ring-2 ring-yellow-400 rounded-full ring-offset-2 ring-offset-transparent w-10 h-10 flex items-center justify-center overflow-hidden">
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "!w-10 !h-10", // Force kích thước
                                userButtonImage: "!w-full !h-full",
                                userButtonTrigger: "!p-0 !border-none !shadow-none focus:!shadow-none",
                            },
                        }}
                    />
                </div>
            ) : (
                // Fallback khi đang load hoặc chưa login (đề phòng)
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse border-2 border-white"></div>
            )}

            <div className="text-white">
              {/* Hiển thị tên từ Clerk */}
              <p className="text-sm font-semibold">
                {clerkUser?.fullName || clerkUser?.firstName || "Admin"}
              </p>
              <p className="text-xs opacity-80">🎄 Ho Ho Ho!</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white
              hover:bg-red-700 hover:scale-105 transition flex items-center gap-2"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <style>{`
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default Navbar;