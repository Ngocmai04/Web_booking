import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

// Christmas Snow Glow Icon
const Snowflake = () => (
  <svg
    className="w-6 h-6 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
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

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const { openSignIn } = useClerk();
  const { user, setShowHotelReg, isOwner, isAdmin, navigate } = useAppContext();

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
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50
      ${
        isScrolled
          ? "bg-white/70 shadow-md backdrop-blur-lg py-3 md:py-4 border-b border-red-200"
          : "py-4 md:py-6 bg-gradient-to-b from-red-600/70 to-transparent"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-10 transition-all duration-300 ${
            isScrolled
              ? "filter brightness-100 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
              : "drop-shadow-[0_0_8px_white]"
          }`}
        />

        {!isScrolled && <Snowflake />}
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((navLink, index) => (
          <NavLink
            key={index}
            to={navLink.path}
            className={`group flex flex-col gap-0.5 text-lg tracking-wide ${
              isScrolled
                ? "text-red-600"
                : "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
            }`}
            onClick={() => scrollTo(0, 0)}
          >
            {navLink.name}
            <div
              className={`${
                isScrolled ? "bg-red-600" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full`}
            ></div>
          </NavLink>
        ))}

        {/* Hotel Button */}
        {user && (
          <button
            className={`border px-5 py-1.5 text-sm rounded-full tracking-wide cursor-pointer transition-all backdrop-blur-sm ${
              isScrolled
                ? "text-red-600 border-red-600"
                : "text-white border-white/80 bg-white/10"
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
            onClick={openSignIn}
            className="bg-red-600 text-white px-8 py-2.5 rounded-full shadow-md shadow-red-500/40 hover:bg-red-700 transition-all"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <UserButton />
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menu"
          className={`${isScrolled ? "invert-0" : "invert"} h-5 cursor-pointer`}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white/90 backdrop-blur-xl text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-red-700 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeMenu} alt="close-menu" className="h-7" />
        </button>

        {navLinks.map((navLink) => (
          <NavLink
            key={navLink.name}
            to={navLink.path}
            onClick={() => setIsMenuOpen(false)}
          >
            {navLink.name}
          </NavLink>
        ))}

        {user && (
          <>
            <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>
              My Bookings
            </NavLink>
            {isOwner && (
              <button
                className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowHotelReg(true);
                }}
              >
                List Another Hotel
              </button>
            )}
            <button
              className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
              onClick={() => {
                setIsMenuOpen(false);
                isAdmin
                  ? navigate("/admin")
                  : isOwner
                  ? navigate("/owner")
                  : setShowHotelReg(true);
              }}
            >
              {isAdmin
                ? "Admin Panel"
                : isOwner
                ? "Dashboard"
                : "List Your Hotel"}
            </button>
          </>
        )}

        {!user && (
          <button
            onClick={openSignIn}
            className="bg-red-600 text-white px-8 py-2.5 rounded-full shadow-lg shadow-red-400/40"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
