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
      // Chỉ lấy khách sạn đã được duyệt
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

  // Pagination
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
        Hotel Management
      </h1>

      {/* Filter and Add Button */}
      <div className="mb-6 flex gap-2 flex-wrap justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "inactive", label: "Removed" },
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
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
        >
          {showAddForm ? "Cancel" : "+ Add New Hotel"}
        </button>
      </div>

      {/* Add Hotel Form */}
      {showAddForm && (
        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Hotel
          </h2>
          <AddHotelAdminForm
            onSuccess={() => {
              setShowAddForm(false);
              fetchHotels();
            }}
          />
        </div>
      )}

      {/* Hotels Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-gray-600 font-medium">Hotel</th>
                <th className="py-4 px-4 text-gray-600 font-medium">City</th>
                <th className="py-4 px-4 text-gray-600 font-medium">Owner</th>
                <th className="py-4 px-4 text-gray-600 font-medium">Status</th>
                <th className="py-4 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHotels.map((hotel) => (
                <tr key={hotel._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{hotel.name}</p>
                      <p className="text-sm text-gray-500">{hotel.address}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{hotel.city}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">
                        {hotel.owner?.username || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {hotel.owner?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${
                                              hotel.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                    >
                      {hotel.isActive ? "Active" : "Removed"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => toggleActive(hotel._id)}
                        className={`px-3 py-1 rounded-lg text-sm
                                                    ${
                                                      hotel.isActive
                                                        ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                                        : "bg-green-100 text-green-600 hover:bg-green-200"
                                                    }`}
                      >
                        {hotel.isActive ? "Remove" : "Restore"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedHotels.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No hotels found
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
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredHotels.length)} of{" "}
          {filteredHotels.length} hotels
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

export default ManageHotels;
