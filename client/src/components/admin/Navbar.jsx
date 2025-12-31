import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
// 1. Import các hook của Clerk
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';

const Navbar = () => {
  const { logout } = useAppContext();
  const [scrolled, setScrolled] = useState(false);

  // 2. Lấy thông tin user từ Clerk
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Hàm xử lý đăng xuất (kết hợp cả Clerk và AppContext)
  const handleLogout = async () => {
    try {
      await signOut(); // Đăng xuất khỏi Clerk
      if (logout) logout(); // Xóa state của App (nếu có)
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          {/* Bell */}
          <button
            className="relative p-2 rounded-full bg-white/20 backdrop-blur border border-white/30
            hover:scale-110 hover:bg-white/30 transition"
          >
            🔔
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

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