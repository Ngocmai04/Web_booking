import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

// Animated Snowflake with glow effect
const Snowflake = () => (
  <svg
    className="w-6 h-6 text-white animate-spin-slow drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
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
);

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

// Christmas Lights Background
const ChristmasLights = () => (
  <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
    <div className="flex animate-lights w-full justify-between">
      {[...Array(42)].map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full mx-4 ${i % 4 === 0
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
);

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/", requireAuth: false, icon: "fa-home" },
    { name: "Hotels", path: "/rooms", requireAuth: false, icon: "fa-hotel" },
    { name: "Experience", path: "/experience", requireAuth: false, icon: "fa-compass" },
    { name: "About", path: "/about", requireAuth: false, icon: "fa-info-circle" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navbarRef = useRef(null);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { openSignIn } = useClerk();
  const { user, setShowHotelReg, isOwner, isAdmin, navigate } = useAppContext();
  const { user: clerkUser, isLoaded } = useUser();

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/rooms?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.scrollTo(0, 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        document.documentElement.style.setProperty("--navbar-height", `${height}px`);
      }
    };
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);
    return () => window.removeEventListener("resize", updateNavbarHeight);
  }, [isScrolled]);

  return (
    <>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes swing { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
        @keyframes twinkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.8); } }
        @keyframes lights { 0% { transform: translateX(0); } 100% { transform: translateX(-200px); } }
        @keyframes snow-fall { 0% { transform: translateY(-10px) translateX(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh) translateX(100px); opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-swing { animation: swing 1s ease-in-out infinite; transform-origin: top center; }
        .animate-lights { animation: lights 10s linear infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .snowflake { position: absolute; color: white; animation: snow-fall linear infinite; pointer-events: none; }
      `}</style>

      <nav
        ref={navbarRef}
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-[100] overflow-visible
        ${isScrolled
            ? "bg-gradient-to-r from-red-700 via-green-700 to-red-700 shadow-2xl backdrop-blur-lg py-2 md:py-4 border-b-2 border-yellow-400"
            : isHomePage
              ? "py-2.5 md:py-6 bg-gradient-to-b from-red-600/90 via-green-600/60 to-transparent"
              : "bg-gradient-to-r from-red-700 via-green-700 to-red-700 py-2 md:py-4"
          }`}
      >
        {isHomePage && !isScrolled && <ChristmasLights />}

        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="snowflake text-2xl hidden md:block"
            style={{
              left: `${i * 12 + 5}%`,
              animationDuration: `${8 + i * 2}s`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${10 + i * 2}px`,
            }}
          >
            ❄
          </div>
        ))}

        {/* Logo - Smaller on Mobile */}
        <Link to="/" className="flex items-center gap-1 md:gap-2 animate-float relative z-10">
          <img
            src={assets.logo}
            alt="logo"
            className={`h-12 md:h-20 transition-all duration-300 ${isScrolled
              ? "filter brightness-100 drop-shadow-[0_0_15px_rgba(255,215,0,1)]"
              : "drop-shadow-[0_0_12px_white]"
              }`}
          />
          <div className="hidden md:block">
            {!isScrolled && <Snowflake />}
            {isScrolled && <ChristmasBell />}
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 relative z-10">
          {navLinks
            .filter(navLink => !navLink.requireAuth || user)
            .map((navLink, index) => (
              <NavLink
                key={index}
                to={navLink.path}
                className={`group flex flex-col gap-0.5 text-lg font-bold tracking-wide transition-all relative
              ${isScrolled
                    ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    : "text-white drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
                  }`}
                onClick={() => scrollTo(0, 0)}
              >
                <span className="relative flex items-center gap-2">
                  <i className={`fas ${navLink.icon}`}></i>
                  {navLink.name}
                </span>
                <div
                  className={`h-1 w-0 group-hover:w-full transition-all duration-300 rounded-full
                ${isScrolled
                      ? "bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                      : "bg-white shadow-[0_0_8px_white]"
                    }
              `}
                ></div>
              </NavLink>
            ))}

          {/* Desktop Search Bar */}
          <div className="relative group">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all duration-300
              ${isScrolled
                  ? "bg-white/90 border-red-300 shadow-lg"
                  : "bg-white/20 border-white/50 backdrop-blur-md"
                }`}
            >
              <i className={`fas fa-search ${isScrolled ? "text-gray-600" : "text-white"}`}></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                placeholder="Search hotels..."
                className={`w-40 lg:w-48 bg-transparent outline-none font-medium transition-all
                  ${isScrolled ? "text-gray-700 placeholder-gray-400" : "text-white placeholder-white/70"}`}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className={`text-sm font-bold px-3 py-1 rounded-full transition-all
                  ${isScrolled
                    ? "bg-gradient-to-r from-red-500 to-green-500 text-white hover:shadow-md"
                    : "bg-white/30 text-white hover:bg-white/40"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <i className="fas fa-tree"></i>
              </button>
            </div>
            <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10 ${isScrolled ? "bg-red-400" : "bg-white"}`}></div>
          </div>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3 relative z-[110]">
          {isLoaded && clerkUser ? (
            <div className="relative user-menu-container flex items-center gap-3">
              <div className="ring-2 ring-yellow-400 rounded-full ring-offset-2 ring-offset-transparent p-0.5 w-10 h-10 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform cursor-pointer">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "!w-full !h-full",
                      userButtonImage: "!w-full !h-full",
                      userButtonTrigger: "!p-0 !border-none !shadow-none focus:!shadow-none",
                    },
                  }}
                />
              </div>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 hover:scale-105 transition-transform">
                <div className="flex flex-col items-start">
                  <p className="text-white font-semibold text-sm drop-shadow-md">
                    {clerkUser.fullName || clerkUser.firstName || clerkUser.username}
                  </p>
                  <p className="text-yellow-200 text-xs flex items-center gap-1">
                    <i className="fas fa-tree text-xs"></i> Welcome!
                  </p>
                </div>
                <i className={`fas fa-chevron-down text-white text-sm transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-2xl border-2 border-red-200 overflow-hidden z-[9999]">
                  <div className="bg-gradient-to-r from-red-500 to-green-500 p-4 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={clerkUser.imageUrl} alt="Profile" className="w-12 h-12 rounded-full ring-2 ring-white" />
                      <div className="flex-1">
                        <p className="font-bold text-lg truncate">{clerkUser.fullName || clerkUser.firstName}</p>
                        <p className="text-xs opacity-90 truncate">{clerkUser.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (isAdmin) navigate("/admin");
                        else if (isOwner) navigate("/owner");
                        else setShowHotelReg(true);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors w-full group"
                    >
                      <i className={`fas ${isAdmin ? 'fa-crown' : isOwner ? 'fa-tree' : 'fa-hotel'} text-green-500 group-hover:scale-110 transition-transform`}></i>
                      <span className="font-medium">{isAdmin ? "Admin Panel" : isOwner ? "Dashboard" : "List Your Hotel"}</span>
                    </button>
                    <NavLink
                      to="/my-bookings"
                      onClick={() => {
                        setShowUserMenu(false);
                        scrollTo(0, 0);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 transition-colors group"
                    >
                      <i className="fas fa-calendar-check text-red-500 group-hover:scale-110 transition-transform"></i>
                      <span className="font-medium">My Bookings</span>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openSignIn}
              className="bg-gradient-to-r from-red-600 to-green-600 text-white px-8 py-2.5 rounded-full shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-green-500/50 transition-all font-bold hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <i className="fas fa-sleigh"></i> Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          )}
        </div>

        {/* Mobile Right Section - Compact */}
        <div className="flex md:hidden items-center gap-2 relative z-10">
          {isLoaded && clerkUser ? (
            <>
              <div className="ring-2 ring-yellow-400 rounded-full p-0.5 w-8 h-8 flex items-center justify-center overflow-hidden">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "!w-full !h-full",
                      userButtonImage: "!w-full !h-full",
                      userButtonTrigger: "!p-0 !border-none !shadow-none focus:!shadow-none",
                    },
                  }}
                />
              </div>
              <p className="text-white font-semibold text-xs drop-shadow-md truncate max-w-[60px]">
                {clerkUser.firstName}
              </p>
            </>
          ) : (
            <button
              onClick={openSignIn}
              className="bg-gradient-to-r from-red-600 to-green-600 text-white px-4 py-1.5 rounded-full shadow-lg font-bold text-xs hover:scale-105 transition-all flex items-center gap-1"
            >
              <i className="fas fa-sleigh text-xs"></i>
              Login
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-2xl hover:scale-110 transition-transform"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 z-[200] w-full h-screen bg-gradient-to-br from-red-600/95 via-green-600/95 to-red-600/95 backdrop-blur-xl flex flex-col items-center justify-start pt-20 gap-6 font-bold text-white transition-all duration-500 md:hidden overflow-y-auto ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button className="absolute top-4 right-4 hover:scale-110 transition-transform text-3xl" onClick={() => setIsMenuOpen(false)}>
          <i className="fas fa-times"></i>
        </button>

        {/* User Info - Mobile */}
        {isLoaded && clerkUser && (
          <div className="flex flex-col items-center mb-4 p-4">
            <div className="ring-2 ring-yellow-400 rounded-full ring-offset-2 ring-offset-red-800 p-1 mb-3">
              <img src={clerkUser.imageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            </div>
            <p className="text-white font-bold text-xl">{clerkUser.fullName || clerkUser.firstName}</p>
            <p className="text-yellow-200 text-sm flex items-center gap-2">
              <i className="fas fa-tree"></i> Welcome back!
            </p>
          </div>
        )}

        {/* Mobile Search Bar */}
        <div className="relative w-4/5 max-w-md">
          <div className="flex items-center gap-2 px-4 py-3 rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-md shadow-lg">
            <i className="fas fa-search text-white"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Search hotels..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/70 font-medium"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="text-lg font-bold px-3 py-1 rounded-full bg-white/30 hover:bg-white/40 transition-all disabled:opacity-50"
            >
              <i className="fas fa-tree"></i>
            </button>
          </div>
        </div>

        {/* Navigation Links - Mobile */}
        {navLinks.filter(navLink => !navLink.requireAuth || user).map((navLink) => (
          <NavLink
            key={navLink.name}
            to={navLink.path}
            onClick={() => {
              setIsMenuOpen(false);
              scrollTo(0, 0);
            }}
            className={({ isActive }) =>
              `text-xl hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] flex items-center gap-3 ${isActive ? "text-yellow-300" : "text-white"}`
            }
          >
            <i className={`fas ${navLink.icon}`}></i>
            {navLink.name}
          </NavLink>
        ))}

        {/* Mobile - My Bookings Link */}
        {user && (
          <NavLink
            to="/my-bookings"
            onClick={() => {
              setIsMenuOpen(false);
              scrollTo(0, 0);
            }}
            className="text-xl hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] flex items-center gap-3 text-white"
          >
            <i className="fas fa-calendar-check"></i>
            My Bookings
          </NavLink>
        )}

        {/* Dashboard Button - Mobile */}
        {user && (
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 px-8 py-3 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-all mt-4 flex items-center gap-2"
            onClick={() => {
              setIsMenuOpen(false);
              if (isAdmin) navigate("/admin");
              else if (isOwner) navigate("/owner");
              else setShowHotelReg(true);
            }}
          >
            <i className={`fas ${isAdmin ? 'fa-crown' : isOwner ? 'fa-tree' : 'fa-hotel'}`}></i>
            {isAdmin ? "Admin Panel" : isOwner ? "Dashboard" : "List Your Hotel"}
          </button>
        )}

        {/* Login Button - Mobile - Only if not logged in */}
        {!user && (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              openSignIn();
            }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 px-8 py-3 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-all mt-6 flex items-center gap-2"
          >
            <i className="fas fa-sleigh"></i>
            Login
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;