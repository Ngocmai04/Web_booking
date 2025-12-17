import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useClerk, UserButton } from "@clerk/clerk-react";
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
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const { openSignIn } = useClerk();
  const { user, setShowHotelReg, isOwner, isAdmin, navigate } = useAppContext();

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/rooms?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

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
        @keyframes snow-fall {
          0% { transform: translateY(-10px) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) translateX(100px); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
        }
        @keyframes slide-down {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>

      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 overflow-hidden
        ${isScrolled
            ? "bg-gradient-to-r from-red-700 via-green-700 to-red-700 shadow-2xl backdrop-blur-lg py-3 md:py-4 border-b-2 border-yellow-400"
            : "py-4 md:py-6 bg-gradient-to-b from-red-600/80 via-green-600/60 to-transparent"
          }`}
      >
        {/* Christmas Lights Decoration */}
        {!isScrolled && <ChristmasLights />}

        {/* Falling Snowflakes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="snowflake text-2xl"
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

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 animate-float relative z-10">
          <img
            src={assets.logo}
            alt="logo"
            className={`h-10 transition-all duration-300 ${isScrolled
              ? "filter brightness-100 drop-shadow-[0_0_15px_rgba(255,215,0,1)]"
              : "drop-shadow-[0_0_12px_white]"
              }`}
          />
          {!isScrolled && <Snowflake />}
          {isScrolled && <ChristmasBell />}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 relative z-10">
          {navLinks.map((navLink, index) => (
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
              <span className="relative">
                {navLink.name}
                {index === 0 && (
                  <span className="absolute -top-2 -right-3 text-xs">🎄</span>
                )}
                {index === 1 && (
                  <span className="absolute -top-2 -right-3 text-xs">🎁</span>
                )}
              </span>
              <div
                className={`h-1 w-0 group-hover:w-full transition-all duration-300 rounded-full
                ${isScrolled ? "bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.8)]" : "bg-white shadow-[0_0_8px_white]"}
              `}
              ></div>
            </NavLink>
          ))}

          {/* Christmas Search Bar */}
          <form onSubmit={handleSearch} className="relative group">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all duration-300
              ${isScrolled
                ? "bg-white/90 border-red-300 shadow-lg"
                : "bg-white/20 border-white/50 backdrop-blur-md"
              }`}>
              <svg
                className={`w-5 h-5 transition-colors
                  ${isScrolled ? "text-gray-600" : "text-white"}
                `}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels..."
                className={`w-40 lg:w-48 bg-transparent outline-none font-medium transition-all
                  ${isScrolled
                    ? "text-gray-700 placeholder-gray-400"
                    : "text-white placeholder-white/70"
                  }`}
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className={`text-sm font-bold px-3 py-1 rounded-full transition-all
                  ${isScrolled
                    ? "bg-gradient-to-r from-red-500 to-green-500 text-white hover:shadow-md"
                    : "bg-white/30 text-white hover:bg-white/40"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                🎄
              </button>
            </div>
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10
              ${isScrolled ? "bg-red-400" : "bg-white"}`}></div>
          </form>

          {/* Hotel Button */}
          {user && (
            <button
              className={`px-5 py-2 text-sm font-bold rounded-full tracking-wide transition-all backdrop-blur-md shadow-lg relative overflow-hidden group
              ${isScrolled
                  ? "text-red-700 bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500 hover:from-yellow-400 hover:to-yellow-500"
                  : "text-white bg-gradient-to-r from-red-500/80 to-green-500/80 border-2 border-white/70 hover:from-red-600/90 hover:to-green-600/90"
                }`}
              onClick={() =>
                isOwner ? navigate("/owner") : setShowHotelReg(true)
              }
            >
              <span className="relative z-10">
                {isOwner ? "🎄 Dashboard" : "🎁 List Your Hotel"}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3 relative z-10">
          {user ? (
            <div className="ring-2 ring-yellow-400 rounded-full ring-offset-2 ring-offset-transparent">
              <UserButton />
            </div>
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

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden relative z-10">
          <div className="ring-2 ring-yellow-400 rounded-full ring-offset-2">
            <UserButton />
          </div>
          <img
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            src={assets.menuIcon}
            alt="menu"
            className={`${isScrolled ? "invert-0" : "invert"
              } h-5 cursor-pointer hover:scale-110 transition-transform`}
          />
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-red-600/95 via-green-600/95 to-red-600/95 backdrop-blur-xl text-base flex flex-col md:hidden items-center justify-center gap-6 font-bold text-white transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={() =>
              isAdmin
                ? navigate("/admin")
                : isOwner
                ? navigate("/owner")
                : setShowHotelReg(true)
            }
          >
            {isAdmin
              ? "Admin Panel"
              : isOwner
              ? "Dashboard"
              : "List Your Hotel"}
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`${
            isScrolled ? "invert-0" : "invert"
          } h-7 transition-all duration-500 drop-shadow-[0_0_4px_white]`}
        />
        {user ? (
          <UserButton />
        ) : (
          <button
            className="absolute top-4 right-4 hover:scale-110 transition-transform"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={assets.closeMenu} alt="close-menu" className="h-7 invert" />
          </button>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="relative group w-4/5 max-w-md">
            <div className="flex items-center gap-2 px-4 py-3 rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-md shadow-lg">
              <span className="text-xl">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels..."
                className="flex-1 bg-transparent outline-none text-white placeholder-white/70 font-medium"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="text-lg font-bold px-3 py-1 rounded-full bg-white/30 hover:bg-white/40 transition-all disabled:opacity-50"
              >
                🎄
              </button>
            </div>
            <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10 bg-white"></div>
          </form>

          {navLinks.map((navLink) => (
            <NavLink
              key={navLink.name}
              to={navLink.path}
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            >
              {navLink.name} ⭐
            </NavLink>
          ))}

          {user && (
            <>
              <NavLink
                to="/my-bookings"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              >
                My Bookings 🎁
              </NavLink>
              <button
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 px-6 py-2 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-all"
                onClick={() => {
                  setIsMenuOpen(false);
                  isOwner ? navigate("/owner") : setShowHotelReg(true);
                }}
              >
                {isOwner ? "🎄 Dashboard" : "🎁 List Your Hotel"}
              </button>
            </>
          )}

          {!user && (
            <button
              onClick={openSignIn}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 px-8 py-3 rounded-full shadow-lg font-bold text-xl hover:scale-105 transition-all"
            >
              🎅 Login
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;