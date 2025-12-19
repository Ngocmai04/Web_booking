import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageRooms = () => {
  const { axios, getToken, currency } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;
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
        Room Management
      </h1>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-gray-600 font-medium">Image</th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Room Type
                </th>
                <th className="py-4 px-4 text-gray-600 font-medium">Hotel</th>
                <th className="py-4 px-4 text-gray-600 font-medium">City</th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Price/Night
                </th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Hotel Status
                </th>
                <th className="py-4 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <img
                      src={room.images?.[0] || "https://via.placeholder.com/60"}
                      alt={room.roomType}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium">{room.roomType}</p>
                    <p className="text-sm text-gray-500">
                      {room.amenities?.slice(0, 2).join(", ")}
                      {room.amenities?.length > 2 && "..."}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium">{room.hotel?.name || "N/A"}</p>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {room.hotel?.city || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-green-600 font-medium">
                    {currency}
                    {room.pricePerNight}
                  </td>
                  <td className="py-4 px-4">
                    {!room.hotel?.isApproved ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Hotel Pending Approval
                      </span>
                    ) : !room.hotel?.isActive ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Hotel Removed
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => deleteRoom(room._id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No rooms available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">Total: {rooms.length} rooms</p>
    </div>
  );
};

export default ManageRooms;
