import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets, cities } from "../assets/assets";

const HotelReg = () => {
  const {
    setShowHotelReg,
    axios,
    getToken,
    setIsOwner,
    fetchOwnerHotels,
    fetchHotels,
  } = useAppContext();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const { data } = await axios.post(
        `/api/hotels/`,
        { name, contact, address, city },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowHotelReg(false);
        fetchOwnerHotels();
        fetchHotels();
        setName("");
        setContact("");
        setAddress("");
        setCity("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-gradient-to-b from-blue-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-sm"
    >
      {/* Snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white text-opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="relative flex bg-gradient-to-br from-white via-red-50 to-green-50 rounded-2xl max-w-4xl max-md:mx-2 shadow-2xl overflow-hidden border-4 border-red-200 hover:border-green-300 transition-all duration-500 hover:scale-105"
      >
        {/* Decorative lights */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-red-500 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-green-500 via-red-500 via-yellow-400 via-blue-500 to-green-500 animate-pulse"></div>

        <img
          src={assets.regImage}
          alt="reg-image"
          className="w-1/2 rounded-l-2xl hidden md:block object-cover filter brightness-110 hover:brightness-125 transition-all duration-300"
        />

        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          {/* Decorative stars */}
          <div className="absolute top-6 left-6 text-yellow-400 text-2xl animate-pulse">
            ⭐
          </div>
          <div className="absolute top-9 right-11 text-red-500 text-3xl animate-bounce">
            🎄
          </div>
          <div className="absolute bottom-5 left-5 text-green-500 text-2xl animate-pulse">
            🎁
          </div>

          <img
            src={assets.closeIcon}
            alt="close-icon"
            className="absolute top-4 right-4 h-5 w-5 cursor-pointer hover:rotate-90 hover:scale-125 transition-all duration-300 bg-red-500 hover:bg-red-600 rounded-full p-1"
            onClick={() => setShowHotelReg(false)}
          />

          <div className="relative">
            <p className="text-3xl font-bold mt-6 bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent animate-pulse">
              🎅 Register Your Hotel 🎄
            </p>
            <div className="absolute -top-2 -right-4 text-yellow-400 text-xl animate-spin">
              ✨
            </div>
          </div>

          <div className="w-full mt-6 group">
            <label
              htmlFor="name"
              className="font-semibold text-red-700 flex items-center gap-2"
            >
              🏨 Hotel Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border-2 border-red-200 rounded-lg w-full px-4 py-3 mt-1 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 font-light bg-white hover:bg-red-50 transition-all duration-300 focus:shadow-lg"
              type="text"
              required
            />
          </div>

          <div className="w-full mt-4 group">
            <label
              htmlFor="contact"
              className="font-semibold text-green-700 flex items-center gap-2"
            >
              📞 Phone
            </label>
            <input
              id="contact"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              placeholder="Type here"
              className="border-2 border-green-200 rounded-lg w-full px-4 py-3 mt-1 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 font-light bg-white hover:bg-green-50 transition-all duration-300 focus:shadow-lg"
              type="text"
              required
            />
          </div>

          <div className="w-full mt-4 group">
            <label
              htmlFor="address"
              className="font-semibold text-red-700 flex items-center gap-2"
            >
              📍 Address
            </label>
            <textarea
              id="address"
              rows="2"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              placeholder="Type here"
              className="border-2 border-red-200 rounded-lg w-full px-4 py-3 mt-1 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 font-light resize-none bg-white hover:bg-red-50 transition-all duration-300 focus:shadow-lg"
              type="text"
              required
            />
          </div>

          <div className="w-full mt-4 max-w-60 mr-auto group">
            <label
              htmlFor="city"
              className="font-semibold text-green-700 flex items-center gap-2"
            >
              🌆 City
            </label>
            <select
              id="city"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className="border-2 border-green-200 rounded-lg w-full px-4 py-3 mt-1 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-200 font-light bg-white hover:bg-green-50 transition-all duration-300 cursor-pointer focus:shadow-lg"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button className="relative bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-size-200 hover:bg-right-bottom text-white font-bold mx-auto px-8 py-3 rounded-full cursor-pointer mt-6 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-yellow-400 hover:border-yellow-300 overflow-hidden group block">
            <span className="relative z-10 flex items-center gap-2">
              🎁 Register Now!
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-green-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </button>

          {/* Decorative elements */}
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 animate-bounce">
            🎅
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .hover\\:bg-right-bottom:hover {
          background-position: right bottom;
        }
      `}</style>
    </div>
  );
};

export default HotelReg;
