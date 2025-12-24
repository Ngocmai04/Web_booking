import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import AddRoomAdminForm from "./AddRoomAdminForm";

const ManageRooms = () => {
  const { axios, getToken, currency } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 10;

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/admin/rooms", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms by hotel status
  const filteredRooms = rooms.filter((room) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return room.hotel?.isApproved && room.hotel?.isActive;
    if (filterStatus === "pending") return !room.hotel?.isApproved;
    if (filterStatus === "inactive") return !room.hotel?.isActive;
    return true;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-door-open text-2xl text-orange-600 animate-pulse"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Christmas theme */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-12 h-12 text-orange-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600">
            Room Management
          </h1>
          <svg className="w-12 h-12 text-amber-600 animate-bounce delay-100" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
        </div>
        <p className="text-gray-600 ml-16 flex items-center gap-2">
          <i className="fas fa-bed text-orange-500"></i>
          Manage all accommodation rooms this holiday season!
          <i className="fas fa-bed text-amber-500"></i>
        </p>
      </div>

      {/* Filter and Add Button */}
      <div className="mb-6 flex gap-4 flex-wrap justify-between items-center">
        <div className="flex gap-3 flex-wrap">
          {[
            { key: "all", label: "All Rooms", icon: "fa-list" },
            { key: "active", label: "Active", icon: "fa-check-circle" },
            { key: "pending", label: "Pending", icon: "fa-clock" },
            { key: "inactive", label: "Inactive", icon: "fa-ban" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilterStatus(f.key);
                setCurrentPage(1);
              }}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 
                       transform hover:scale-105 hover:shadow-lg flex items-center gap-2
                       border-2 ${
                filterStatus === f.key
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-yellow-300 shadow-xl scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              }`}
            >
              <i className={`fas ${f.icon} text-lg`}></i>
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform
                   hover:scale-105 hover:shadow-xl flex items-center gap-2 border-2
                   ${showAddForm 
                     ? "bg-gray-500 text-white border-gray-600 hover:bg-gray-600" 
                     : "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-yellow-300 hover:from-amber-600 hover:to-orange-600"
                   }`}
        >
          <i className={`fas ${showAddForm ? "fa-times" : "fa-plus-circle"} text-xl`}></i>
          {showAddForm ? "Cancel" : "Add New Room"}
        </button>
      </div>

      {/* Add Room Form */}
      {showAddForm && (
        <div className="mb-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl p-6 border-4 border-orange-200
                      hover:border-amber-200 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-door-open text-4xl text-orange-600"></i>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Add New Room
            </h2>
          </div>
          <AddRoomAdminForm
            onSuccess={() => {
              setShowAddForm(false);
              fetchRooms();
            }}
          />
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-orange-100
                    hover:border-amber-200 hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-door-open text-4xl text-white"></i>
            <h3 className="text-2xl font-bold text-white">Rooms Directory</h3>
            <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
              <tr className="border-b-2 border-orange-200">
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-image text-pink-600"></i>
                    Image
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-bed text-orange-600"></i>
                    Room Type
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-hotel text-red-600"></i>
                    Hotel
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-green-600"></i>
                    City
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-dollar-sign text-green-600"></i>
                    Price/Night
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-info-circle text-purple-600"></i>
                    Status
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-cogs text-blue-600"></i>
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRooms.map((room) => (
                <tr key={room._id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 
                             transition-all duration-300 group">
                  <td className="py-4 px-4">
                    <div className="relative group/img">
                      <img
                        src={room.images?.[0] || "https://via.placeholder.com/60"}
                        alt={room.roomType}
                        className="w-20 h-16 object-cover rounded-xl border-4 border-orange-200 
                                 group-hover/img:border-amber-400 group-hover/img:scale-110 transition-all duration-300 cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 
                                    transition-opacity rounded-xl flex items-center justify-center">
                        <i className="fas fa-search-plus text-white text-xl"></i>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-bed text-orange-500 text-xl"></i>
                      <div>
                        <p className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                          {room.roomType}
                        </p>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 group/amenities relative">
                          <i className="fas fa-star text-yellow-500"></i>
                          <span className="truncate max-w-[150px]">
                            {room.amenities?.slice(0, 2).join(", ")}
                            {room.amenities?.length > 2 && "..."}
                          </span>
                          {room.amenities?.length > 0 && (
                            <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white p-3 rounded-lg 
                                          opacity-0 invisible group-hover/amenities:opacity-100 group-hover/amenities:visible
                                          transition-all duration-300 z-10 shadow-xl min-w-[200px]">
                              <p className="font-semibold mb-2 text-yellow-300">Amenities:</p>
                              {room.amenities.map((amenity, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm mb-1">
                                  <i className="fas fa-check text-green-400"></i>
                                  {amenity}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 group/hotel relative">
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                      <span className="font-semibold text-gray-800 truncate max-w-[120px]">
                        {room.hotel?.name || "N/A"}
                      </span>
                      {room.hotel?.name && room.hotel.name.length > 15 && (
                        <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white px-3 py-2 rounded-lg 
                                      opacity-0 invisible group-hover/hotel:opacity-100 group-hover/hotel:visible
                                      transition-all duration-300 z-10 shadow-xl whitespace-nowrap">
                          {room.hotel.name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-700 font-medium">
                        {room.hotel?.city || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-money-bill-wave text-green-600 text-xl"></i>
                      <span className="text-green-600 font-bold text-lg">
                        {currency}{room.pricePerNight}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {!room.hotel?.isApproved ? (
                      <span className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2
                                   bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-2 border-yellow-300">
                        <i className="fas fa-clock"></i>
                        Pending Approval
                      </span>
                    ) : !room.hotel?.isActive ? (
                      <span className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2
                                   bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-red-300">
                        <i className="fas fa-ban"></i>
                        Hotel Removed
                      </span>
                    ) : (
                      <span className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2
                                   bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-300">
                        <i className="fas fa-check-circle"></i>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => deleteRoom(room._id)}
                      className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                               transform hover:scale-110 hover:shadow-xl border-2 flex items-center gap-2
                               bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300 
                               hover:from-red-600 hover:to-pink-600"
                    >
                      <i className="fas fa-trash-alt"></i>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedRooms.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <i className="fas fa-door-open text-7xl text-gray-300"></i>
                      <p className="text-gray-500 text-xl font-semibold">No rooms found</p>
                      <p className="text-gray-400">Try adjusting your filters!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
        <div className="bg-white px-5 py-3 rounded-xl shadow-md border-2 border-orange-200">
          <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
            <i className="fas fa-list text-orange-600"></i>
            Showing <span className="text-orange-600 font-bold">{startIndex + 1}</span> to{" "}
            <span className="text-orange-600 font-bold">{Math.min(startIndex + itemsPerPage, filteredRooms.length)}</span> of{" "}
            <span className="text-amber-600 font-bold">{filteredRooms.length}</span> rooms
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform
                     hover:scale-105 hover:shadow-lg border-2 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300"
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300
                         transform hover:scale-110 border-2 ${
                  page === currentPage
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-yellow-300 shadow-xl scale-110"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform
                     hover:scale-105 hover:shadow-lg border-2 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300"
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* FontAwesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default ManageRooms;