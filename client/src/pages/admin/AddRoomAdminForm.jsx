import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddRoomAdminForm = ({ onSuccess }) => {
  const { axios, getToken } = useAppContext();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotelLoading, setHotelLoading] = useState(true);

  const [formData, setFormData] = useState({
    hotelId: "",
    roomType: "",
    pricePerNight: "",
    amenities: "",
    images: "",
  });

  // Lấy danh sách khách sạn
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
      setHotelLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (
      !formData.hotelId ||
      !formData.roomType ||
      !formData.pricePerNight ||
      !formData.amenities
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amenitiesArray = formData.amenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    if (amenitiesArray.length === 0) {
      toast.error("Please enter at least one amenity (comma-separated)");
      return;
    }

    const imagesArray = formData.images
      ? formData.images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img.length > 0)
      : [];

    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/admin/rooms",
        {
          hotelId: formData.hotelId,
          roomType: formData.roomType,
          pricePerNight: formData.pricePerNight,
          amenities: amenitiesArray,
          images: imagesArray,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setFormData({
          hotelId: "",
          roomType: "",
          pricePerNight: "",
          amenities: "",
          images: "",
        });
        onSuccess();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (hotelLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hotel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel <span className="text-red-600">*</span>
          </label>
          <select
            name="hotelId"
            value={formData.hotelId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          >
            <option value="">Select Hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name} ({hotel.city})
              </option>
            ))}
          </select>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            placeholder="e.g., Single, Double, Suite"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        {/* Price Per Night */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Per Night ($) <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleChange}
            placeholder="e.g., 99.99"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g., WiFi, AC, TV, Hot Water"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple amenities with commas
          </p>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URLs (Optional)
          </label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="e.g., https://image1.jpg, https://image2.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple image URLs with commas
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Room"}
        </button>
      </div>
    </form>
  );
};

export default AddRoomAdminForm;
