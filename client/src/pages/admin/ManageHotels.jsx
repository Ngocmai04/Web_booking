import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import AddHotelAdminForm from "./AddHotelAdmin";

const ManageHotels = () => {
  const { axios, getToken } = useAppContext();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get("/api/admin/hotels?isApproved=true", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setHotels(data.hotels);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (hotelId) => {
    try {
      const { data } = await axios.put(
        `/api/admin/hotels/${hotelId}/toggle-active`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteHotel = async (hotelId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this hotel permanently? All rooms will also be deleted."
      )
    )
      return;
    try {
      const { data } = await axios.delete(`/api/admin/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success(data.message);
        fetchHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    if (filter === "all") return true;
    if (filter === "active") return hotel.isActive;
    if (filter === "inactive") return !hotel.isActive;
    return true;
  });

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-hotel text-2xl text-red-600 animate-pulse"></i>
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
          <svg className="w-12 h-12 text-red-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600">
            Hotel Management
          </h1>
          <svg className="w-12 h-12 text-green-600 animate-bounce delay-100" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
        </div>
        <p className="text-gray-600 ml-16 flex items-center gap-2">
          <i className="fas fa-candy-cane text-red-500"></i>
          Manage your festive accommodations with holiday cheer!
          <i className="fas fa-candy-cane text-green-500"></i>
        </p>
      </div>

      {/* Filter and Add Button */}
      <div className="mb-6 flex gap-4 flex-wrap justify-between items-center">
        <div className="flex gap-3 flex-wrap">
          {[
            { key: "all", label: "All Hotels", icon: "fa-hotel" },
            { key: "active", label: "Active", icon: "fa-check-circle" },
            { key: "inactive", label: "Removed", icon: "fa-ban" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setCurrentPage(1);
              }}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 
                       transform hover:scale-105 hover:shadow-lg flex items-center gap-2
                       border-2 ${
                filter === f.key
                  ? "bg-gradient-to-r from-red-500 to-green-500 text-white border-yellow-300 shadow-xl scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50"
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
                     : "bg-gradient-to-r from-green-500 to-red-500 text-white border-yellow-300 hover:from-green-600 hover:to-red-600"
                   }`}
        >
          <i className={`fas ${showAddForm ? "fa-times" : "fa-plus-circle"} text-xl`}></i>
          {showAddForm ? "Cancel" : "Add New Hotel"}
        </button>
      </div>

      {/* Add Hotel Form */}
      {showAddForm && (
        <div className="mb-6 bg-gradient-to-br from-red-50 to-green-50 rounded-2xl shadow-xl p-6 border-4 border-red-200
                      hover:border-green-200 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
              Add New Hotel
            </h2>
          </div>
          <AddHotelAdminForm
            onSuccess={() => {
              setShowAddForm(false);
              fetchHotels();
            }}
          />
        </div>
      )}

      {/* Hotels Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-red-100
                    hover:border-green-200 hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 p-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-building text-4xl text-white"></i>
            <h3 className="text-2xl font-bold text-white">Hotels Directory</h3>
            <svg className="w-8 h-8 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-red-50 to-green-50">
              <tr className="border-b-2 border-red-200">
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
                    <i className="fas fa-user-tie text-blue-600"></i>
                    Owner
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
                    <i className="fas fa-cogs text-orange-600"></i>
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedHotels.map((hotel, index) => (
                <tr key={hotel._id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 
                             transition-all duration-300 group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <svg className="w-10 h-10 text-red-500 group-hover:text-red-600 transition-colors" 
                             fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white 
                                      group-hover:scale-125 transition-transform flex items-center justify-center">
                          <i className="fas fa-star text-white text-xs"></i>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                          {hotel.name}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <i className="fas fa-map-pin text-xs"></i>
                          {hotel.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-700 font-medium">{hotel.city}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-user-circle text-2xl text-blue-500"></i>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {hotel.owner?.username || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <i className="fas fa-envelope text-xs"></i>
                          {hotel.owner?.email || ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-2
                               transition-all duration-300 hover:scale-105 border-2
                               ${hotel.isActive
                                 ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-300"
                                 : "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300"
                               }`}
                    >
                      <i className={`fas ${hotel.isActive ? "fa-check-circle" : "fa-times-circle"}`}></i>
                      {hotel.isActive ? "Active" : "Removed"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => toggleActive(hotel._id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                               transform hover:scale-110 hover:shadow-xl border-2 flex items-center gap-2
                               ${hotel.isActive
                                 ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300 hover:from-orange-600 hover:to-red-600"
                                 : "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-300 hover:from-green-600 hover:to-emerald-600"
                               }`}
                      >
                        <i className={`fas ${hotel.isActive ? "fa-trash-alt" : "fa-undo"}`}></i>
                        {hotel.isActive ? "Remove" : "Restore"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedHotels.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-20 h-20 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                      <p className="text-gray-500 text-xl font-semibold">No hotels found</p>
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
        <div className="bg-white px-5 py-3 rounded-xl shadow-md border-2 border-red-200">
          <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
            <i className="fas fa-list text-red-600"></i>
            Showing <span className="text-red-600 font-bold">{startIndex + 1}</span> to{" "}
            <span className="text-red-600 font-bold">{Math.min(startIndex + itemsPerPage, filteredHotels.length)}</span> of{" "}
            <span className="text-green-600 font-bold">{filteredHotels.length}</span> hotels
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform
                     hover:scale-105 hover:shadow-lg border-2 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300"
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
                    ? "bg-gradient-to-r from-red-500 to-green-500 text-white border-yellow-300 shadow-xl scale-110"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
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
                     bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* FontAwesome CDN - Add this to your index.html if not already included */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default ManageHotels;