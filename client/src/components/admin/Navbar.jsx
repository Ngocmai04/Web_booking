import React from "react";
import { assets } from "../../assets/assets";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      <Link to="/" className="flex items-center gap-3">
        <img className="h-9 invert opacity-80" src={assets.logo} alt="logo" />
        <span className="text-red-600 font-semibold text-lg hidden md:block">
          Admin Panel
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden md:block">
          Quản trị viên
        </span>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
