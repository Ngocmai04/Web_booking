import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const { axios, getToken, currency, ownerHotels, fetchOwnerHotels, user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch owner hotels on mount
  useEffect(() => {
    if (user && !ownerHotels.length) {
      fetchOwnerHotels();
    }
  }, [user, ownerHotels, fetchOwnerHotels]);

  // Set default selected hotel
  useEffect(() => {
    if (ownerHotels.length && !selectedHotelId) {
      setSelectedHotelId(ownerHotels[0]._id);
    }
  }, [ownerHotels, selectedHotelId]);

  const fetchBookings = useCallback(async () => {
    if (!selectedHotelId) return;
    
    setLoading(true);
    try {
      const params = { hotelId: selectedHotelId };
      const { data } = await axios.get("/api/bookings/hotel", {
        params,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.dashboardData?.bookings || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [axios, getToken, selectedHotelId]);

  useEffect(() => {
    if (selectedHotelId) {
      fetchBookings();
    }
  }, [selectedHotelId, fetchBookings]);

  const handleMarkAsPaid = async (bookingId) => {
    try {
      const { data } = await axios.put(
        `/api/bookings/mark-paid/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "paid") return booking.isPaid;
    if (filter === "unpaid") return !booking.isPaid;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-calendar-check text-2xl text-red-600 animate-pulse"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* FontAwesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <i className="fas fa-calendar-check text-4xl text-red-600 animate-bounce"></i>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600">
            Quản Lý Đặt Phòng
          </h1>
          <i className="fas fa-gift text-4xl text-green-600 animate-bounce delay-100"></i>
        </div>
        <p className="text-gray-600 ml-16 flex items-center gap-2">
          <i className="fas fa-snowflake text-blue-500"></i>
          Theo dõi và quản lý tất cả đơn đặt phòng của khách sạn bạn
          <i className="fas fa-snowflake text-blue-500"></i>
        </p>
      </div>

      {/* Hotel Selection */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {ownerHotels.map((hotel) => (
          <button
            key={hotel._id}
            onClick={() => {
              setSelectedHotelId(hotel._id);
              setCurrentPage(1);
            }}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 transform
                      border-3 shadow-lg cursor-pointer relative overflow-hidden group
                      ${selectedHotelId === hotel._id
                        ? "bg-gradient-to-r from-red-600 to-green-600 text-white border-yellow-400 scale-110 shadow-xl"
                        : "bg-white text-gray-700 border-red-300 hover:scale-105 hover:border-green-400 hover:shadow-xl"
                      }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {selectedHotelId === hotel._id && <i className="fas fa-gift"></i>}
              {hotel.name} - {hotel.city}
            </span>
          </button>
        ))}
        {!ownerHotels.length && (
          <div className="bg-red-100 border-3 border-red-400 rounded-2xl px-6 py-4 shadow-lg">
            <p className="text-sm text-red-700 font-bold flex items-center gap-2">
              <i className="fas fa-exclamation-triangle"></i>
              Bạn chưa có khách sạn nào. Hãy đăng ký khách sạn trước.
            </p>
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {[
          { key: "all", label: "Tất cả", icon: "fa-list" },
          { key: "pending", label: "Chờ xử lý", icon: "fa-clock" },
          { key: "confirmed", label: "Đã xác nhận", icon: "fa-check-circle" },
          { key: "cancelled", label: "Đã hủy", icon: "fa-times-circle" },
          { key: "paid", label: "Đã thanh toán", icon: "fa-money-bill-wave" },
          { key: "unpaid", label: "Chưa thanh toán", icon: "fa-exclamation-circle" },
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

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-red-100
                    hover:border-green-200 hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 p-6">
          <div className="flex items-center gap-3">
            <i className="fas fa-clipboard-list text-4xl text-white"></i>
            <h3 className="text-2xl font-bold text-white">Danh Sách Đặt Phòng</h3>
            <i className="fas fa-star text-yellow-300 animate-pulse text-2xl"></i>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-red-50 to-green-50">
              <tr className="border-b-2 border-red-200">
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-hashtag text-red-600"></i>
                    <span>STT</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-user text-blue-600"></i>
                    <span>Khách hàng</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-bed text-green-600"></i>
                    <span>Phòng</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-clock text-purple-600"></i>
                    <span>Thời gian đặt</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-calendar-alt text-orange-600"></i>
                    <span>Check-in/out</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-users text-cyan-600"></i>
                    <span>Khách</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-dollar-sign text-green-600"></i>
                    <span>Tổng tiền</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-credit-card text-indigo-600"></i>
                    <span>Thanh toán</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-info-circle text-red-600"></i>
                    <span>Trạng thái</span>
                  </div>
                </th>
                <th className="py-4 px-3 text-gray-700 font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-cogs text-pink-600"></i>
                    <span>Thao tác</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 
                           transition-all duration-300 group"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-green-400 
                                    flex items-center justify-center text-white font-bold text-xs
                                    group-hover:scale-110 transition-transform">
                        {startIndex + index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-user-circle text-xl text-blue-500"></i>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate max-w-[120px]">
                          {booking.user?.username || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                          {booking.user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-bed text-green-600"></i>
                      <span className="text-gray-700 font-medium text-sm truncate max-w-[100px]">
                        {booking.room?.roomType || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block bg-purple-100 text-purple-800 font-bold py-1 px-3 rounded-lg text-xs">
                      {formatDateTime(booking.createdAt)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <i className="fas fa-sign-in-alt text-xs"></i>
                        <span>{formatDate(booking.checkInDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-600 font-medium">
                        <i className="fas fa-sign-out-alt text-xs"></i>
                        <span>{formatDate(booking.checkOutDate)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 font-bold py-1 px-3 rounded-lg text-sm">
                      <i className="fas fa-users text-xs"></i>
                      {booking.guests}
                    </span>
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
                        <span className="text-xs text-gray-700 font-medium truncate max-w-[80px]">
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
                        <span className="text-xs">{booking.isPaid ? "Đã TT" : "Chưa TT"}</span>
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
                    {!booking.isPaid && booking.paymentMethod === "Pay At Hotel" && (
                      <button
                        onClick={() => handleMarkAsPaid(booking._id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                                 text-xs font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 
                                 transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                      >
                        <i className="fas fa-check"></i>
                        Đã thanh toán
                      </button>
                    )}
                    {booking.isPaid && (
                      <span className="text-green-600 font-medium text-xs flex items-center gap-1">
                        <i className="fas fa-check-circle"></i>
                        Hoàn tất
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedBookings.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <i className="fas fa-calendar-times text-6xl text-gray-300"></i>
                      <p className="text-gray-500 text-xl font-semibold">Không có đơn đặt phòng nào</p>
                      <p className="text-gray-400">Thử thay đổi bộ lọc hoặc chọn khách sạn khác!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
          <div className="bg-white px-5 py-3 rounded-xl shadow-md border-2 border-red-200">
            <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
              <i className="fas fa-list text-red-600"></i>
              Hiển thị <span className="text-red-600 font-bold">{Math.min(startIndex + 1, filteredBookings.length)}</span> đến{" "}
              <span className="text-red-600 font-bold">{Math.min(startIndex + itemsPerPage, filteredBookings.length)}</span> trong{" "}
              <span className="text-green-600 font-bold">{filteredBookings.length}</span> đơn
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
              Trước
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
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
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform
                       hover:scale-105 hover:shadow-lg border-2 flex items-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
            >
              Sau
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
