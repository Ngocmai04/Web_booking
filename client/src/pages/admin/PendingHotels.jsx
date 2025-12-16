import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const PendingHotels = () => {
  const { axios, getToken } = useAppContext();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingHotels = async () => {
    try {
      const { data } = await axios.get("/api/admin/hotels/pending", {
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

  const approveHotel = async (hotelId) => {
    try {
      const { data } = await axios.put(
        `/api/admin/hotels/${hotelId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchPendingHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const rejectHotel = async (hotelId) => {
    if (!window.confirm("Are you sure you want to reject this hotel?")) return;
    try {
      const { data } = await axios.put(
        `/api/admin/hotels/${hotelId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchPendingHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPendingHotels();
  }, []);

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
        Hotels Pending Approval
      </h1>

      {hotels.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-md">
          <p className="text-gray-500 text-lg">No hotels pending approval!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {hotel.name}
                    </h3>
                    <p className="text-sm text-gray-500">{hotel.city}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>
                    <strong>Address:</strong> {hotel.address}
                  </p>
                  <p>
                    <strong>Contact:</strong> {hotel.contact}
                  </p>
                  <p>
                    <strong>Owner:</strong> {hotel.owner?.username || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {hotel.owner?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Registered:</strong>{" "}
                    {new Date(hotel.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => approveHotel(hotel._id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectHotel(hotel._id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-gray-500">
        Total: {hotels.length} hotels pending approval
      </p>
    </div>
  );
};

export default PendingHotels;
