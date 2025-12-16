import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageHotels = () => {
  const { axios, getToken } = useAppContext();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, inactive

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
        "Bạn có chắc muốn xóa khách sạn này vĩnh viễn? Tất cả phòng cũng sẽ bị xóa."
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

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "active", label: "Active" },
          { key: "inactive", label: "Removed" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
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
              {filteredHotels.map((hotel) => (
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
                      {/* <button
                        onClick={() => deleteHotel(hotel._id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                      >
                        Remove
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredHotels.length === 0 && (
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

      <p className="mt-4 text-sm text-gray-500">
        Total: {filteredHotels.length} hotels
      </p>
    </div>
  );
};

export default ManageHotels;
