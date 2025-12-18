import React, { useState } from "react";
import {
  FaHotel,
  FaMapLocationDot,
  FaCity,
  FaPhoneVolume,
  FaTree,
  FaSpinner,
  FaStar,
  FaCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import OSMAddressAutocomplete from "../../components/hotelOwner/OSMAddressAutocomplete";

const AddHotel = () => {
  const { axios, getToken, fetchOwnerHotels } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    name: "",
    address: "",
    contact: "",
    city: "",
    latitude: null,
    longitude: null,
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const hasCoords =
      Number.isFinite(inputs.latitude) && Number.isFinite(inputs.longitude);
    if (
      !inputs.name ||
      !inputs.address ||
      !inputs.contact ||
      !inputs.city ||
      !hasCoords
    ) {
      toast.error("🎅 Please fill in all the details!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...inputs,
        latitude: inputs.latitude,
        longitude: inputs.longitude,
      };
      const { data } = await axios.post("/api/hotels", payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(`🎁 ${data.message}`);
        setInputs({
          name: "",
          address: "",
          contact: "",
          city: "",
          latitude: null,
          longitude: null,
        });
        fetchOwnerHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmitHandler}>
      {/* Header */}
      <div className="mb-8 relative">
        <div className="absolute -top-2 -left-2 text-6xl opacity-20 animate-bounce text-red-600">
          <FaHotel />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 mb-3 drop-shadow-lg flex items-center gap-4">
          <FaHotel className="text-red-600" /> Add Hotel
        </h1>
        <p className="text-gray-700 font-semibold text-lg leading-relaxed">
          Fill in the details carefully with accurate hotel information to help
          customers find and book your property.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Hotel Name */}
        <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-100 border-4 border-red-400 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-300 rounded-bl-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="absolute -top-4 -right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity text-red-800">
            <FaHotel />
          </div>

          <p className="text-red-700 font-black mb-4 text-xl flex items-center gap-3 drop-shadow-md">
            <FaHotel /> Hotel Name
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
              Required
            </span>
          </p>
          <input
            type="text"
            name="name"
            // Lưu ý: Placeholder chỉ nhận text, không nhận component SVG
            placeholder="Enter hotel name..."
            className="border-4 border-red-400 rounded-xl p-4 w-full font-bold text-gray-700 text-lg focus:border-green-500 focus:ring-4 focus:ring-green-200 outline-none transition-all shadow-lg bg-white placeholder:text-gray-400"
            value={inputs.name}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 border-4 border-blue-400 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-300 rounded-tr-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="absolute -bottom-4 -left-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity text-blue-800">
            <FaMapLocationDot />
          </div>

          <p className="text-blue-700 font-black mb-4 text-xl flex items-center gap-3 drop-shadow-md">
            <FaMapLocationDot /> Address
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              Required
            </span>
          </p>
          <OSMAddressAutocomplete
            value={inputs.address}
            onChange={(next) =>
              setInputs((prev) => ({
                ...prev,
                address: next,
                latitude: null,
                longitude: null,
              }))
            }
            onSelect={(picked) =>
              setInputs((prev) => ({
                ...prev,
                address: picked.displayName,
                city: prev.city || picked.city,
                latitude: picked.latitude,
                longitude: picked.longitude,
              }))
            }
            placeholder="Search hotel address (OpenStreetMap)..."
            disabled={loading}
          />
          <div
            className={`mt-4 p-4 rounded-xl border-3 font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
              Number.isFinite(inputs.latitude) &&
              Number.isFinite(inputs.longitude)
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-yellow-100 border-yellow-400 text-yellow-700"
            }`}
          >
            {Number.isFinite(inputs.latitude) &&
            Number.isFinite(inputs.longitude) ? (
              <>
                <FaCheck className="text-lg" /> Selected coordinates:{" "}
                {inputs.latitude.toFixed(6)}, {inputs.longitude.toFixed(6)}
              </>
            ) : (
              <>
                <FaTriangleExclamation className="text-lg" /> Pick an address
                from suggestions to save coordinates.
              </>
            )}
          </div>
        </div>

        {/* City */}
        <div className="bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 border-4 border-green-400 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-20 h-20 bg-green-300 rounded-br-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="absolute -top-4 -left-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity text-green-800">
            <FaCity />
          </div>

          <p className="text-green-700 font-black mb-4 text-xl flex items-center gap-3 drop-shadow-md">
            <FaCity /> City
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
              Required
            </span>
          </p>
          <input
            type="text"
            name="city"
            placeholder="Enter city name..."
            className="border-4 border-green-400 rounded-xl p-4 w-full font-bold text-gray-700 text-lg focus:border-red-500 focus:ring-4 focus:ring-red-200 outline-none transition-all shadow-lg bg-white placeholder:text-gray-400"
            value={inputs.city}
            onChange={handleChange}
          />
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 border-4 border-yellow-400 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-yellow-300 rounded-tl-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity text-yellow-800">
            <FaPhoneVolume />
          </div>

          <p className="text-yellow-700 font-black mb-4 text-xl flex items-center gap-3 drop-shadow-md">
            <FaPhoneVolume /> Contact
            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
              Required
            </span>
          </p>
          <input
            type="text"
            name="contact"
            placeholder="Enter contact number or email..."
            className="border-4 border-yellow-400 rounded-xl p-4 w-full font-bold text-gray-700 text-lg focus:border-green-500 focus:ring-4 focus:ring-green-200 outline-none transition-all shadow-lg bg-white placeholder:text-gray-400"
            value={inputs.contact}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white font-black px-16 py-5 rounded-2xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl hover:scale-105 transition-all border-4 border-yellow-400 text-xl relative overflow-hidden group w-full md:w-auto"
            disabled={loading}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-2xl" />
                  <span>Adding Hotel...</span>
                </>
              ) : (
                <>
                  <FaTree className="text-2xl" />
                  <span>Add Hotel</span>
                  <FaTree className="text-2xl" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Animated Stars */}
            {!loading && (
              <>
                <div className="absolute top-2 left-4 text-yellow-300 animate-ping opacity-0 group-hover:opacity-100">
                  <FaStar />
                </div>
                <div
                  className="absolute bottom-2 right-4 text-yellow-300 animate-ping opacity-0 group-hover:opacity-100"
                  style={{ animationDelay: "0.2s" }}
                >
                  <FaStar />
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddHotel;
