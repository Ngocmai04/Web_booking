import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import {
  Bed,
  Hotel,
  Image,
  DollarSign,
  Sparkles,
  Save,
  ArrowLeft,
  Loader2,
  X,
} from "lucide-react";

const EditRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { axios, getToken, ownerHotels, fetchOwnerHotels } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [fetchingRoom, setFetchingRoom] = useState(true);
  const [roomData, setRoomData] = useState({
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
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [selectedHotelId, setSelectedHotelId] = useState("");

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setFetchingRoom(true);
        const { data } = await axios.get(`/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });

        if (data.success) {
          const room = data.room;
          setRoomData({
            roomType: room.roomType,
            pricePerNight: room.pricePerNight,
            amenities: {
              "Free WiFi": room.amenities.includes("Free WiFi"),
              "Free Breakfast": room.amenities.includes("Free Breakfast"),
              "Room Service": room.amenities.includes("Room Service"),
              "Mountain View": room.amenities.includes("Mountain View"),
              "Pool Access": room.amenities.includes("Pool Access"),
            },
          });
          setExistingImages(room.images || []);
          setSelectedHotelId(room.hotel._id);
        } else {
          toast.error(data.message);
          navigate("/hotel-owner/rooms");
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        toast.error("Failed to fetch room details");
        navigate("/hotel-owner/rooms");
      } finally {
        setFetchingRoom(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId, axios, getToken, navigate]);

  // Fetch owner hotels if needed
  useEffect(() => {
    if (!ownerHotels.length) {
      fetchOwnerHotels();
    }
  }, [ownerHotels, fetchOwnerHotels]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomData.roomType || !roomData.pricePerNight) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", roomData.roomType);
      formData.append("pricePerNight", roomData.pricePerNight);

      const amenities = Object.keys(roomData.amenities).filter(
        (key) => roomData.amenities[key]
      );
      formData.append("amenities", JSON.stringify(amenities));

      // Add new images if any
      Object.keys(newImages).forEach((key) => {
        if (newImages[key]) {
          formData.append("images", newImages[key]);
        }
      });

      const { data } = await axios.put(`/api/rooms/${roomId}`, formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("🎉 Room updated successfully!");
        navigate("/owner/list-room");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading room details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/owner/list-room")}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Rooms
        </button>

        <div className="flex items-start gap-4">
          <div className="text-5xl">✏️</div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mb-2">
              Edit Room
            </h1>
            <p className="text-gray-600 font-semibold">
              Update room details, images, and amenities
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-4 border-blue-400 rounded-3xl p-8 shadow-2xl">
          {/* Hotel Info - Read Only */}
          <div className="mb-6 bg-white rounded-2xl p-6 border-3 border-blue-300">
            <p className="text-blue-700 font-black text-lg mb-3 flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              Hotel
            </p>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl px-5 py-3 border-2 border-blue-300">
              <p className="font-bold text-gray-800">
                {ownerHotels.find((h) => h._id === selectedHotelId)?.name || "Unknown Hotel"}
              </p>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <p className="text-purple-700 font-black text-lg mb-3 flex items-center gap-2">
                <Image className="w-5 h-5" />
                Current Images
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Room ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border-3 border-purple-300 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Current Image</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div className="mb-6">
            <p className="text-blue-700 font-black text-lg mb-3 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Upload New Images (Optional - will replace existing)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(newImages).map((key) => (
                <label
                  key={key}
                  htmlFor={`newImage${key}`}
                  className="relative group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl border-3 border-blue-300 hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-lg">
                    {newImages[key] ? (
                      <>
                        <img
                          className="w-full h-32 object-cover"
                          src={URL.createObjectURL(newImages[key])}
                          alt=""
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setNewImages({ ...newImages, [key]: null });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                        <img
                          className="w-12 h-12 opacity-50"
                          src={assets.uploadArea}
                          alt=""
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {newImages[key] ? "Change" : "Upload"}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id={`newImage${key}`}
                    hidden
                    onChange={(e) =>
                      setNewImages({ ...newImages, [key]: e.target.files[0] })
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
                Room Type *
              </p>
              <select
                className="border-3 border-purple-300 rounded-xl p-3 w-full font-semibold text-gray-700 focus:border-green-500 focus:ring-3 focus:ring-green-200 outline-none transition-all shadow-sm bg-white"
                value={roomData.roomType}
                onChange={(e) =>
                  setRoomData({ ...roomData, roomType: e.target.value })
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
                Price <span className="text-sm font-normal">/night</span> *
              </p>
              <input
                type="number"
                placeholder="0"
                min="0"
                className="border-3 border-red-300 rounded-xl p-3 w-full font-bold text-gray-700 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 outline-none transition-all shadow-sm bg-white"
                value={roomData.pricePerNight}
                onChange={(e) =>
                  setRoomData({ ...roomData, pricePerNight: e.target.value })
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
              {Object.keys(roomData.amenities).map((amenity, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white border-2 border-indigo-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={roomData.amenities[amenity]}
                    onChange={() =>
                      setRoomData({
                        ...roomData,
                        amenities: {
                          ...roomData.amenities,
                          [amenity]: !roomData.amenities[amenity],
                        },
                      })
                    }
                    className="w-4 h-4 text-indigo-600 rounded border-2 border-indigo-300"
                  />
                  <span className="font-semibold text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:from-green-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Room
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/owner/list-room")}
              className="bg-gray-200 text-gray-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-300 transition-all shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
