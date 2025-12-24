import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const { axios, getToken, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      const { data } = await axios.put(
        `/api/admin/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-300";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300";
      default:
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "fa-check-circle";
      case "cancelled":
        return "fa-times-circle";
      default:
        return "fa-clock";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-calendar-check text-2xl text-purple-600 animate-pulse"></i>
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
          <svg className="w-12 h-12 text-purple-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
          </svg>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
            Booking Management
          </h1>
          <svg className="w-12 h-12 text-pink-600 animate-bounce delay-100" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </div>
        <p className="text-gray-600 ml-16 flex items-center gap-2">
          <i className="fas fa-gifts text-purple-500"></i>
          Track and manage all holiday bookings with festive joy!
          <i className="fas fa-gifts text-pink-500"></i>
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {[
          { key: "all", label: "All Bookings", icon: "fa-list" },
          { key: "pending", label: "Pending", icon: "fa-clock" },
          { key: "confirmed", label: "Confirmed", icon: "fa-check-circle" },
          { key: "cancelled", label: "Cancelled", icon: "fa-times-circle" },
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
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-yellow-300 shadow-xl scale-105"
                : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
            }`}
          >
            <i className={`fas ${f.icon} text-lg`}></i>
            {f.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-purple-100
                    hover:border-pink-200 hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-clipboard-list text-4xl text-white"></i>
            <h3 className="text-2xl font-bold text-white">Bookings Directory</h3>
            <svg className="w-8 h-8 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr className="border-b-2 border-purple-200">
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-hashtag text-purple-600"></i>
                    <span>ID</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-user text-blue-600"></i>
                    <span>Customer</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-hotel text-red-600"></i>
                    <span>Hotel</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-bed text-green-600"></i>
                    <span>Room</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-calendar-alt text-orange-600"></i>
                    <span>Dates</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-dollar-sign text-green-600"></i>
                    <span>Price</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-credit-card text-indigo-600"></i>
                    <span>Payment</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-info-circle text-purple-600"></i>
                    <span>Status</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-cogs text-pink-600"></i>
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking, index) => (
                <tr key={booking._id} 
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 
                             transition-all duration-300 group">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 
                                    flex items-center justify-center text-white font-bold text-xs
                                    group-hover:scale-110 transition-transform">
                        {startIndex + index + 1}
                      </div>
                      <span className="text-xs text-gray-500 font-mono">
                        ...{booking._id.slice(-4)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 group/customer relative">
                      <i className="fas fa-user-circle text-xl text-blue-500"></i>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate max-w-[100px]">
                          {booking.user?.username || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">
                          {booking.user?.email || ""}
                        </p>
                      </div>
                      {/* Tooltip on hover */}
                      {booking.user?.email && (
                        <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white p-3 rounded-lg 
                                      opacity-0 invisible group-hover/customer:opacity-100 group-hover/customer:visible
                                      transition-all duration-300 z-10 shadow-xl whitespace-nowrap">
                          <p className="font-semibold mb-1">{booking.user.username}</p>
                          <p className="text-xs">{booking.user.email}</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 group/hotel relative">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                      </svg>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate max-w-[100px]">
                          {booking.hotel?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[100px]">
                          {booking.hotel?.city || ""}
                        </p>
                      </div>
                      {/* Tooltip */}
                      {booking.hotel?.name && (
                        <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white p-3 rounded-lg 
                                      opacity-0 invisible group-hover/hotel:opacity-100 group-hover/hotel:visible
                                      transition-all duration-300 z-10 shadow-xl whitespace-nowrap">
                          <p className="font-semibold mb-1">{booking.hotel.name}</p>
                          <p className="text-xs flex items-center gap-1">
                            <i className="fas fa-map-marker-alt"></i>
                            {booking.hotel.city}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-bed text-green-600"></i>
                      <span className="text-gray-700 font-medium text-sm truncate max-w-[80px]">
                        {booking.room?.roomType || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <i className="fas fa-sign-in-alt text-xs"></i>
                        <span>{new Date(booking.checkInDate).toLocaleDateString("en-GB")}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600 font-medium">
                        <i className="fas fa-sign-out-alt text-xs"></i>
                        <span>{new Date(booking.checkOutDate).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <i className="fas fa-money-bill-wave text-green-600"></i>
                      <span className="text-green-600 font-bold text-sm">
                        {currency}{booking.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <i className="fas fa-credit-card text-indigo-500 text-xs"></i>
                        <span className="text-xs text-gray-700 font-medium truncate max-w-[70px]">
                          {booking.paymentMethod}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1
                                 border transition-all hover:scale-105 w-fit
                                 ${booking.isPaid
                                   ? "bg-green-100 text-green-700 border-green-300"
                                   : "bg-gray-100 text-gray-700 border-gray-300"
                                 }`}
                      >
                        <i className={`fas ${booking.isPaid ? "fa-check" : "fa-times"} text-xs`}></i>
                        <span className="text-xs">{booking.isPaid ? "Paid" : "Unpaid"}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1
                               transition-all duration-300 hover:scale-105 border-2 ${getStatusStyle(booking.status)}`}
                    >
                      <i className={`fas ${getStatusIcon(booking.status)} text-xs`}></i>
                      <span>{getStatusLabel(booking.status)}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking._id, e.target.value)}
                      className="px-3 py-1.5 border-2 border-purple-300 rounded-xl text-xs font-semibold
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               bg-white hover:bg-purple-50 transition-all cursor-pointer
                               text-gray-700 hover:border-purple-400 w-full"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✓ Confirmed</option>
                      <option value="cancelled">✗ Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {paginatedBookings.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-20 h-20 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-gray-500 text-xl font-semibold">No bookings found</p>
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
        <div className="bg-white px-5 py-3 rounded-xl shadow-md border-2 border-purple-200">
          <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
            <i className="fas fa-list text-purple-600"></i>
            Showing <span className="text-purple-600 font-bold">{Math.min(startIndex + 1, filteredBookings.length)}</span> to{" "}
            <span className="text-purple-600 font-bold">{Math.min(startIndex + itemsPerPage, filteredBookings.length)}</span> of{" "}
            <span className="text-pink-600 font-bold">{filteredBookings.length}</span> bookings
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform
                     hover:scale-105 hover:shadow-lg border-2 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300"
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
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-yellow-300 shadow-xl scale-110"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300"
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
                     bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300"
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

export default ManageBookings;