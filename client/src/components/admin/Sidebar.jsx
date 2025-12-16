import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: assets.dashboardIcon },
    { name: "Quản lý Users", path: "/admin/users", icon: assets.listIcon },
    { name: "Quản lý Hotels", path: "/admin/hotels", icon: assets.addIcon },
    { name: "Chờ duyệt", path: "/admin/pending-hotels", icon: assets.addIcon },
    { name: "Quản lý Rooms", path: "/admin/rooms", icon: assets.listIcon },
    {
      name: "Quản lý Bookings",
      path: "/admin/bookings",
      icon: assets.listIcon,
    },
  ];

  return (
    <div className="md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end={item.path === "/admin"}
          className={({ isActive }) =>
            `flex items-center py-3 px-4 md:px-8 gap-3 ${
              isActive
                ? "border-r-4 md:border-r-[6px] bg-red-600/10 border-red-600 text-red-600"
                : "hover:bg-gray-100/90 border-white text-gray-700"
            }`
          }
        >
          <img className="min-h-6 min-w-6" src={item.icon} alt={item.name} />
          <p className="md:block hidden text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
