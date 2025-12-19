import React, { useEffect, useState, useCallback } from "react";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import {
  Bed,
  Hotel,
  Image,
  DollarSign,
  Sparkles,
  Gift,
  Plus,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

const ListRoom = () => {
  const { axios, getToken, user, ownerHotels, fetchOwnerHotels } =
    useAppContext();
  const [rooms, setRooms] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);

  // Add Room form states
  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [loading, setLoading] = useState(false);
  const [addRoomInputs, setAddRoomInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  // Fetch rooms with useCallback to prevent infinite loops
  const fetchRooms = useCallback(async () => {
    try {
      const params = selectedHotelId ? { hotelId: selectedHotelId } : {};
      const { data } = await axios.get("/api/rooms/owner", {
        params,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [selectedHotelId, axios, getToken]);

  // Toggle room availability
  const toggleAvailability = async (roomId) => {
    try {
      const { data } = await axios.post(
        "/api/rooms/toggle-availability",
        { roomId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(`🎁 ${data.message}`);
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add Room form submission
  const onSubmitAddRoom = async (e) => {
    e.preventDefault();
    if (
      !addRoomInputs.roomType ||
      !addRoomInputs.pricePerNight ||
      !selectedHotelId
    ) {
      toast.error("Please fill in all the required details");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", addRoomInputs.roomType);
      formData.append("pricePerNight", addRoomInputs.pricePerNight);
      const amenities = Object.keys(addRoomInputs.amenities).filter(
        (key) => addRoomInputs.amenities[key]
      );
      formData.append("amenities", JSON.stringify(amenities));
      formData.append("hotelId", selectedHotelId);

      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });

      const { data } = await axios.post("/api/rooms/", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setAddRoomInputs({
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Free WiFi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Mountain View": false,
            "Pool Access": false,
          },
        });
        setImages({ 1: null, 2: null, 3: null, 4: null });
        setShowAddRoomForm(false);
        // Refresh rooms list
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (user && !ownerHotels.length) {
      fetchOwnerHotels();
    }
  }, [user, ownerHotels, fetchOwnerHotels]);

  useEffect(() => {
    if (ownerHotels.length && !selectedHotelId) {
      setSelectedHotelId(ownerHotels[0]._id);
    }
  }, [ownerHotels, selectedHotelId]);

  useEffect(() => {
    if (user && (ownerHotels.length || selectedHotelId)) {
      fetchRooms();
    }
  }, [user, selectedHotelId, ownerHotels, fetchRooms]);

  const hotelsAvailable = ownerHotels.length > 0;

  return (
    <div>
      {/* Header with Add Room button */}
      <div className="mb-8 relative">
        <div className="absolute -top-2 -left-2 text-6xl opacity-20 animate-bounce">
          🛏️
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mb-3 drop-shadow-lg">
              🛏️ Room Management
            </h1>
            <p className="text-gray-700 font-semibold text-lg leading-relaxed">
              View, edit, or manage all listed rooms. Add new rooms to expand
              your offerings.
            </p>
          </div>
          <button
            onClick={() => setShowAddRoomForm(!showAddRoomForm)}
            className={`
                            px-6 py-3 rounded-2xl font-black text-sm
                            transition-all duration-300 transform shadow-lg border-4
                            ${
                              showAddRoomForm
                                ? "bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-400"
                                : "bg-gradient-to-r from-green-600 to-blue-600 text-white border-green-400 hover:scale-105"
                            }
                        `}
          >
            {showAddRoomForm ? "✕ Cancel" : "＋ Add New Room"}
          </button>
        </div>
      </div>

      {/* Add Room Form - Conditionally Rendered */}
      {showAddRoomForm && (
        <div className="mb-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-4 border-green-400 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
  <Hotel className="w-8 h-8 text-green-600" />
  Add New Room
</h2>


          <form onSubmit={onSubmitAddRoom}>
            {/* Hotel Selection */}
            <div className="mb-6">
              <p className="text-green-700 font-black text-lg mb-3 flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                Select Hotel
              </p>

              <div className="flex gap-3 flex-wrap">
                {ownerHotels.map((hotel) => (
                  <button
                    type="button"
                    key={hotel._id}
                    onClick={() => setSelectedHotelId(hotel._id)}
                    className={`
                                            relative px-5 py-2.5 rounded-xl font-bold text-sm
                                            transition-all duration-300 transform
                                            border-3 shadow-md
                                            ${
                                              selectedHotelId === hotel._id
                                                ? "bg-gradient-to-r from-green-600 to-blue-600 text-white border-green-400 scale-105"
                                                : "bg-white text-gray-700 border-gray-300 hover:scale-102"
                                            }
                                        `}
                  >
                    {hotel.name} - {hotel.city}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Images */}
            <div className="mb-6">
              <p className="text-blue-700 font-black text-lg mb-3 flex items-center gap-2">
                <Image className="w-5 h-5" />
                Room Images
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(images).map((key) => (
                  <label
                    key={key}
                    htmlFor={`roomImage${key}`}
                    className="relative group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl border-3 border-blue-300 hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-lg">
                      <img
                        className="w-full h-28 object-cover"
                        src={
                          images[key]
                            ? URL.createObjectURL(images[key])
                            : assets.uploadArea
                        }
                        alt=""
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          Click to upload
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      id={`roomImage${key}`}
                      hidden
                      onChange={(e) =>
                        setImages({ ...images, [key]: e.target.files[0] })
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Room Type */}
              <div>
                <p className="text-purple-700 font-black mb-2 flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  Room Type
                </p>

                <select
                  className="border-3 border-purple-300 rounded-xl p-3 w-full font-semibold text-gray-700 focus:border-green-500 focus:ring-3 focus:ring-green-200 outline-none transition-all shadow-sm bg-white"
                  value={addRoomInputs.roomType}
                  onChange={(e) =>
                    setAddRoomInputs({
                      ...addRoomInputs,
                      roomType: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Room Type</option>
                  <option value="Single Bed">Single Bed</option>
                  <option value="Double Bed">Double Bed</option>
                  <option value="Luxury Room">Luxury Room</option>
                  <option value="Family Suite">Family Suite</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <p className="text-red-700 font-black mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Price <span className="text-sm font-normal">/night</span>
                </p>

                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  className="border-3 border-red-300 rounded-xl p-3 w-full font-bold text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 outline-none transition-all shadow-sm bg-white"
                  value={addRoomInputs.pricePerNight}
                  onChange={(e) =>
                    setAddRoomInputs({
                      ...addRoomInputs,
                      pricePerNight: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <p className="text-indigo-700 font-black text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Amenities
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.keys(addRoomInputs.amenities).map((amenity, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white border-2 border-indigo-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-all"
                  >
                    <input
                      type="checkbox"
                      id={`amenities${index + 1}`}
                      checked={addRoomInputs.amenities[amenity]}
                      onChange={() =>
                        setAddRoomInputs({
                          ...addRoomInputs,
                          amenities: {
                            ...addRoomInputs.amenities,
                            [amenity]: !addRoomInputs.amenities[amenity],
                          },
                        })
                      }
                      className="w-4 h-4 text-indigo-600 rounded border-2 border-indigo-300"
                    />
                    <span className="font-semibold text-gray-700">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading || !hotelsAvailable}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Gift className="w-5 h-5 animate-spin" />
                    Adding Room...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Room
                  </>
                )}
              </button>
              {!hotelsAvailable && (
                <div className="bg-red-100 border-2 border-red-400 rounded-lg px-4 py-2">
                  <p className="text-sm text-red-700 font-bold">
                    Please register a hotel first.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Hotel Selection for Rooms List */}
      <div className="mb-6">
        <p className="text-gray-700 font-black text-xl mb-4 flex items-center gap-2">
          <Hotel className="w-6 h-6" />
          Select Hotel to View Rooms
        </p>
        <div className="flex gap-3 flex-wrap">
          {ownerHotels.map((hotel) => (
            <button
              key={hotel._id}
              onClick={() => setSelectedHotelId(hotel._id)}
              className={`
                                relative px-6 py-3 rounded-2xl font-black text-sm
                                transition-all duration-300 transform
                                border-4 shadow-lg
                                ${
                                  selectedHotelId === hotel._id
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-indigo-400 scale-110 shadow-2xl"
                                    : "bg-white text-gray-700 border-blue-300 hover:scale-105 hover:border-purple-400 hover:shadow-xl"
                                }
                            `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {selectedHotelId === hotel._id && (
                  <Hotel className="w-4 h-4 text-white" />
                )}
                {hotel.name} - {hotel.city}
              </span>

              {selectedHotelId === hotel._id && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 to-transparent animate-pulse"></div>
              )}
            </button>
          ))}
          {!ownerHotels.length && (
            <div className="bg-gradient-to-r from-red-100 to-orange-100 border-4 border-red-400 rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-sm text-red-800 font-black flex items-center gap-2">
                🎅 Please register a hotel to manage rooms!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-4 border-blue-400 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-16 h-16 bg-blue-300 rounded-br-full opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-300 rounded-tl-full opacity-30"></div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 flex items-center gap-3">
          🛏️ Available Rooms
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full">
            {rooms.length} rooms
          </span>
        </h2>

        <div className="w-full bg-white rounded-2xl border-4 border-purple-400 shadow-xl overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white sticky top-0 z-10">
                <tr>
                  <th className="py-4 px-6 font-black text-left text-lg">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      Room Type
                    </div>
                  </th>

                  <th className="py-4 px-6 font-black text-left text-lg max-sm:hidden">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Amenities
                    </div>
                  </th>

                  <th className="py-4 px-6 font-black text-center text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Price / Night
                    </div>
                  </th>

                  <th className="py-4 px-6 font-black text-center text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Availability
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Bed className="w-20 h-20 text-purple-400 animate-bounce" />
                        <p className="text-gray-500 text-xl font-bold">
                          No rooms available!
                        </p>
                        <p className="text-gray-400 text-sm">
                          Click "Add New Room" above to add your first room
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rooms.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all border-b-2 border-gray-100 group"
                    >
                      <td className="py-4 px-6 text-gray-800 font-bold text-base">
                        <span className="flex items-center gap-2">
                          <span className="text-xl">🛏️</span>
                          {item.roomType}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-semibold max-sm:hidden">
                        <div className="flex flex-wrap gap-2">
                          {item.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border-2 border-blue-300"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-black text-center text-lg">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {item.pricePerNight}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <label className="relative inline-flex items-center cursor-pointer group/toggle">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            onChange={() => toggleAvailability(item._id)}
                            checked={item.isAvailable}
                          />
                          <div
                            className={`w-16 h-8 rounded-full transition-all duration-300 shadow-lg ${
                              item.isAvailable
                                ? "bg-gradient-to-r from-green-400 to-green-600"
                                : "bg-gradient-to-r from-gray-300 to-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                item.isAvailable
                                  ? "translate-x-8"
                                  : "translate-x-0"
                              }`}
                            >
                              <span className="absolute inset-0 flex items-center justify-center">
                                {item.isAvailable ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <X className="w-4 h-4 text-gray-500" />
                                )}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`ml-3 font-bold text-sm ${
                              item.isAvailable
                                ? "text-green-700"
                                : "text-gray-700"
                            }`}
                          >
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #7c3aed);
                }
            `}</style>
    </div>
  );
};

export default ListRoom;
