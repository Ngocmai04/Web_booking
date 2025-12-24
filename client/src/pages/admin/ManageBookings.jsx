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
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Booking Management
      </h1>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "⏳ Pending" },
          { key: "confirmed", label: "✓ Confirmed" },
          { key: "cancelled", label: "✗ Cancelled" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f.key
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-gray-600 font-medium">ID</th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Customer
                </th>
                <th className="py-4 px-4 text-gray-600 font-medium">Hotel</th>
                <th className="py-4 px-4 text-gray-600 font-medium">Room</th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Check-in/out
                </th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Total Price
                </th>
                <th className="py-4 px-4 text-gray-600 font-medium">Payment</th>
                <th className="py-4 px-4 text-gray-600 font-medium">Status</th>
                <th className="py-4 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-500">
                    ...{booking._id.slice(-6)}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">
                        {booking.user?.username || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.user?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium">
                      {booking.hotel?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.hotel?.city || ""}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {booking.room?.roomType || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <p>
                      {" "}
                      {new Date(booking.checkInDate).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                    <p>
                      {" "}
                      {new Date(booking.checkOutDate).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-green-600 font-medium">
                    {currency}
                    {booking.totalPrice?.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{booking.paymentMethod}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block w-fit
                                                ${
                                                  booking.isPaid
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                      >
                        {booking.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateStatus(booking._id, e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {paginatedBookings.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {Math.min(startIndex + 1, filteredBookings.length)} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of{" "}
          {filteredBookings.length} bookings
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  page === currentPage
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
