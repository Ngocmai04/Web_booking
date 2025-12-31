import { useState, useMemo, useEffect, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import StarRating from "../components/StarRating";
import { useSearchParams } from "react-router-dom";
import { ROOM_TYPES, PRICE_RANGES, SORT_OPTIONS } from "../constants/roomTypes";

const CheckBox = ({ label, selected = true, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = true, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { facilityIcons, navigate, currency, axios, hotels } = useAppContext();
  const [openFilters, setOpenFilters] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [hotelRooms, setHotelRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [ratingsData, setRatingsData] = useState({});
  const [expandedAmenities, setExpandedAmenities] = useState({});

  const destination = searchParams.get("destination") || "";

  const roomTypes = ROOM_TYPES;
  const priceRanges = PRICE_RANGES.map((r) => r.label);
  const sortOptions = SORT_OPTIONS;

  const handleFilterChange = (checked, value, type) => {
  setSelectedFilters((prev) => ({
    ...prev,
    [type]: checked
      ? [...prev[type], value]
      : prev[type].filter((item) => item !== value),
  }));
  };


  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

    const toggleAmenities = (roomId) => {
    setExpandedAmenities(prev => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const matchesRoomType = useCallback(
    (room) => {
      return (
        selectedFilters.roomType.length === 0 ||
        selectedFilters.roomType.includes(room.roomType)
      );
    },
    [selectedFilters.roomType]
  );

  const matchesPriceRange = useCallback(
    (room) => {
      return (
        selectedFilters.priceRange.length === 0 ||
        selectedFilters.priceRange.some((range) => {
          const [min, max] = range.split(" to ").map(Number);
          return room.pricePerNight >= min && room.pricePerNight <= max;
        })
      );
    },
    [selectedFilters.priceRange]
  );

  const sortRooms = useCallback(
    (a, b) => {
      if (selectedSort === "Price Low to High") {
        return a.pricePerNight - b.pricePerNight;
      }
      if (selectedSort === "Price High to Low") {
        return b.pricePerNight - a.pricePerNight;
      }
      if (selectedSort === "Newest First") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    },
    [selectedSort]
  );

  const filteredHotels = useMemo(() => {
    return hotels.filter(
      (hotel) =>
        !destination ||
        hotel.city.toLowerCase().includes(destination.toLowerCase())
    );
  }, [hotels, destination]);

  useEffect(() => {
    if (filteredHotels.length && !selectedHotelId) {
      setSelectedHotelId(filteredHotels[0]._id);
    }

    if (!filteredHotels.length) {
      setSelectedHotelId("");
      setHotelRooms([]);
    }
  }, [filteredHotels, selectedHotelId]);

  useEffect(() => {
    const fetchHotelRooms = async () => {
      if (!selectedHotelId) return;
      setLoadingRooms(true);
      try {
        const { data } = await axios.get("/api/rooms", {
          params: { hotelId: selectedHotelId },
        });
        if (data.success) {
          setHotelRooms(data.rooms);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchHotelRooms();
  }, [selectedHotelId, axios]);

   useEffect(() => {
    const fetchRatingsForRooms = async () => {
      if (!hotelRooms.length) return;
      const newRatingsData = {};
      const uniqueHotelIds = [...new Set(hotelRooms.map(room => room.hotel?._id).filter(Boolean))];
      
      await Promise.all(uniqueHotelIds.map(async (hotelId) => {
        try {
          const res = await axios.get(`/api/ratings/average?hotel=${hotelId}`);
          if (res.data.success) {
            newRatingsData[hotelId] = {
              averageRating: Number(res.data.averages.overall) || 0,
              reviewCount: res.data.totalReviews || 0,
            };
          }
        } catch (err) {
          console.error("Fetch rating failed for hotel:", hotelId, err);
          newRatingsData[hotelId] = { averageRating: 0, reviewCount: 0 };
        }
      }));
      setRatingsData(newRatingsData);
    };
    fetchRatingsForRooms();
  }, [hotelRooms, axios]);

  const filteredRooms = useMemo(() => {
      return hotelRooms
        .filter((room) => matchesRoomType(room) && matchesPriceRange(room))
        .sort(sortRooms);
    }, [hotelRooms, matchesRoomType, matchesPriceRange, sortRooms]);
    const isFiltering =
    selectedFilters.roomType.length > 0 ||
    selectedFilters.priceRange.length > 0;

  const visibleHotels = useMemo(() => {
    if (!isFiltering) return filteredHotels;

    const hotelIdsWithValidRooms = new Set(
      filteredRooms.map(room => room.hotel?._id)
    );

    return filteredHotels.filter(hotel =>
      hotelIdsWithValidRooms.has(hotel._id)
    );
  }, [filteredHotels, filteredRooms, isFiltering]);

  const visibleRooms = useMemo(() => {
    if (!selectedHotelId) return [];
    return filteredRooms.filter(
      (room) => room.hotel?._id === selectedHotelId
    );
  }, [filteredRooms, selectedHotelId]);


  const clearFilters = () => {
    setSelectedFilters({
      roomType: [],
      priceRange: [],
    });
    setSelectedSort("");
    setSearchParams({});
  };
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-900 via-red-950 to-emerald-950 overflow-hidden">
      {/* Magical Christmas Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute text-white animate-snow-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${8 + Math.random() * 12}px`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          >
            <i className="fas fa-snowflake"></i>
          </div>
        ))}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-300 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${6 + Math.random() * 8}px`,
            }}
          >
            <i className="fas fa-star"></i>
          </div>
        ))}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-green-500 via-yellow-400 via-red-500 to-green-500 opacity-70 animate-pulse"></div>
      </div>

      <style>{`
            @keyframes snow-fall {
                0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
            }
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.5); }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            @keyframes slideIn {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes bounce-gift {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(5deg); }
            }
            @keyframes shake-reindeer {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-5deg); }
                75% { transform: rotate(5deg); }
            }
        `}</style>

      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 pb-20">
        {/* Main Content */}
        <div className="w-full lg:pr-8">
          {/* Header Section */}
          <div className="flex flex-col items-start text-left mb-8 relative">
            <div className="absolute -top-4 -left-4 text-6xl text-green-400 animate-float">
              <i className="fas fa-tree"></i>
            </div>
            <div className="absolute -top-2 right-10 text-5xl text-red-400 animate-bounce">
              <i className="fas fa-sleigh"></i>
            </div>

            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 drop-shadow-2xl animate-slideIn flex items-center gap-4">
              Hotel Rooms
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-200 max-w-[42rem] leading-relaxed drop-shadow-lg flex items-start gap-3">
              <i className="fas fa-sparkles text-yellow-300 mt-1 shrink-0"></i>

              <span>
                Take advantage of our limited-time{" "}
                <span className="text-yellow-300 font-bold">
                  Christmas offers
                </span>{" "}
                and special packages to enhance your stay and create
                unforgettable memories!{" "}
                <i className="fas fa-tree text-green-400 ml-1"></i>
              </span>
            </p>
          </div>

          {/* Hotel Selection Pills */}
          <div className="flex gap-3 flex-wrap mb-8">
            {filteredHotels.map((hotel, index) => (
              <button
                key={hotel._id}
                onClick={() => {
                  setSelectedHotelId(hotel._id);
                  scrollTo(0, 0);
                }}
                className={`
                                px-6 py-3 rounded-full font-bold text-sm
                                transition-all duration-300 transform
                                border-3 shadow-lg
                                ${
                                  selectedHotelId === hotel._id
                                    ? "bg-gradient-to-r from-red-600 to-green-600 text-white border-yellow-400 scale-110 shadow-2xl"
                                    : "bg-white/90 backdrop-blur-sm text-gray-700 border-red-300 hover:scale-105 hover:border-green-400"
                                }
                                cursor-pointer relative overflow-hidden group
                            `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {selectedHotelId === hotel._id && (
                    <i className="fas fa-tree text-yellow-300"></i>
                  )}{" "}
                  {hotel.name} - {hotel.city}
                </span>
                {selectedHotelId === hotel._id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-transparent animate-pulse"></div>
                )}
              </button>
            ))}
            {!filteredHotels.length && (
              <div className="bg-red-100/90 backdrop-blur-sm border-3 border-red-400 rounded-2xl px-6 py-4 shadow-lg">
                <p className="text-sm text-red-700 font-bold flex items-center gap-2">
                  <i className="fas fa-exclamation-circle"></i> No hotels found
                  for this destination.
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loadingRooms && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-8xl text-red-400 animate-bounce mb-4">
                  <i className="fas fa-gift"></i>
                </div>
                <p className="text-xl text-white font-bold">
                  Loading magical rooms...
                </p>
              </div>
            </div>
          )}

                    <div className="space-y-8">
            {visibleRooms.map((room, index) => {
              const hotelId = room.hotel?._id;
              const { averageRating = 0, reviewCount = 0 } = ratingsData[hotelId] || {};
              const isExpanded = expandedAmenities[room._id];
              const visibleAmenities = isExpanded ? room.amenities : room.amenities.slice(0, 4);

              return (
                <div key={room._id} className="bg-gradient-to-br from-white via-red-50 to-green-50 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-yellow-400/50 hover:border-green-400 overflow-hidden transform hover:scale-[1.02] transition-all duration-500 animate-slideIn" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative group overflow-hidden">
                      <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-red-600 to-green-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2"><i className="fas fa-tree"></i> Featured</div>
                      {room.discount > 0 && <div className="absolute top-4 left-4 z-20 bg-yellow-400 text-red-700 px-4 py-2 rounded-full font-black text-lg shadow-xl animate-bounce flex items-center gap-2"><i className="fas fa-percent"></i> {room.discount}% OFF</div>}
                      <img title="View Room Details" onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }} src={room.images[0]} alt="hotel-img" className="w-full h-80 md:h-full object-cover cursor-pointer transform group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="md:w-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fas fa-map-marker-alt text-red-600 text-xl"></i>
                          <p className="text-green-700 font-semibold">{room.hotel.city}</p>
                        </div>

                        <h2 onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }} className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-green-700 text-3xl font-playfair font-bold cursor-pointer hover:scale-105 transition-transform inline-block mb-3" title="View Room Details">{room.hotel.name}</h2>

                        <div className="flex items-center gap-2 mb-3">
                          <StarRating rating={averageRating} />
                          <p className="text-gray-600 font-medium flex items-center gap-1">
                            <i className="fas fa-star text-yellow-500"></i>
                            {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews yet'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mb-4 bg-red-100 rounded-lg px-3 py-2 border-2 border-red-300">
                          <i className="fas fa-location-dot text-red-600"></i>
                          <span className="text-sm">{room.hotel.address}</span>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-3">
                            {visibleAmenities.map((item, amenityIndex) => (
                              <div key={amenityIndex} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-100 to-red-100 border-2 border-green-300 shadow-md hover:scale-110 transition-transform">
                                <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                                <p className="text-xs font-semibold text-gray-700">{item}</p>
                              </div>
                            ))}
                            {room.amenities.length > 4 && (
                              <button onClick={() => toggleAmenities(room._id)} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-yellow-100 border-2 border-yellow-400 text-xs font-bold text-yellow-800 hover:bg-yellow-200 hover:scale-110 transition-all cursor-pointer">
                                {isExpanded ? (<><i className="fas fa-chevron-up"></i> Show Less</>) : (<>+{room.amenities.length - 4} more <i className="fas fa-chevron-down"></i></>)}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-green-500 text-white rounded-full text-sm font-bold shadow-lg mb-4 flex items-center gap-2 w-fit">
                          <i className="fas fa-sparkles"></i> {room.roomType}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t-2 border-red-200">
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">${room.pricePerNight}</p>
                          <p className="text-xs text-gray-500">/night</p>
                        </div>
                        <button onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0); }} className="px-6 py-3 bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all border-3 border-yellow-400 flex items-center gap-2">
                          <i className="fas fa-gift"></i> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Rooms Message */}
          {!loadingRooms && selectedHotelId && filteredRooms.length === 0 && (
            <div className="bg-gradient-to-br from-red-100 to-green-100 backdrop-blur-sm border-4 border-red-300 rounded-3xl p-12 text-center shadow-2xl">
              <div className="text-8xl text-red-600 mb-6 animate-bounce">
                <i className="fas fa-face-frown"></i>
              </div>
              <p className="text-2xl font-bold text-red-700 mb-2">
                No rooms available
              </p>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                Try adjusting your filters or check another hotel!{" "}
                <i className="fas fa-tree text-green-600"></i>
              </p>
            </div>
          )}
        </div>

        {/* Filters Sidebar */}
        <div className="lg:sticky lg:top-24 bg-gradient-to-br from-white via-red-50 to-green-50 w-full lg:w-96 border-4 border-red-300 text-gray-600 max-lg:mb-8 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Filter Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 to-green-600 text-white ${
              openFilters && "border-b-4 border-yellow-400"
            }`}
          >
            <p className="text-lg font-black flex items-center gap-2">
              <i className="fas fa-filter"></i> FILTERS
            </p>
            <div className="text-sm cursor-pointer font-bold">
              <span
                onClick={() => setOpenFilters(!openFilters)}
                className="lg:hidden bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-all flex items-center gap-2"
              >
                {openFilters ? (
                  <>
                    HIDE <i className="fas fa-chevron-up"></i>
                  </>
                ) : (
                  <>
                    SHOW <i className="fas fa-chevron-down"></i>
                  </>
                )}
              </span>
              <span
                onClick={clearFilters}
                className="hidden lg:flex items-center gap-2 bg-yellow-400 text-red-700 px-4 py-2 rounded-full hover:scale-110 transition-all shadow-lg"
              >
                <i className="fas fa-trash"></i> CLEAR
              </span>
            </div>
          </div>

          <div
            className={`${
              openFilters ? "max-h-[2000px]" : "max-h-0 lg:max-h-[2000px]"
            } overflow-hidden transition-all duration-700`}
          >
            {/* Room Type Filters */}
            <div className="px-6 pt-6">
              <p className="font-black text-red-700 pb-3 text-lg flex items-center gap-2">
                <i className="fas fa-hotel"></i> Room Types
              </p>
              <div className="space-y-2">
                {roomTypes.map((room, index) => {
                  const isSelected = selectedFilters.roomType.includes(room);
                  return (
                    <label
                      key={index}
                      className={`
                                            flex items-center gap-3 cursor-pointer p-3 rounded-xl
                                            transition-all duration-300 transform
                                            ${
                                              isSelected
                                                ? "bg-gradient-to-r from-red-100 to-green-100 border-3 border-green-400 scale-105 shadow-lg"
                                                : "bg-white border-2 border-gray-200 hover:border-red-300 hover:scale-102"
                                            }
                                        `}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleFilterChange(
                              e.target.checked,
                              room,
                              "roomType"
                            )
                          }
                          className="w-5 h-5 rounded border-2 border-red-300 text-green-600 focus:ring-2 focus:ring-red-500 cursor-pointer"
                        />

                      </div>
                      <span
                        className={`font-semibold select-none ${
                          isSelected ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {room}
                      </span>
                      {isSelected && (
                        <div className="ml-auto text-xl text-amber-700 animate-shake-reindeer">
                          <i className="fas fa-candy-cane"></i>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filters */}
            <div className="px-6 pt-6">
              <p className="font-black text-green-700 pb-3 text-lg flex items-center gap-2">
                <i className="fas fa-dollar-sign"></i> Price Range
              </p>
              <div className="space-y-2">
                {priceRanges.map((range, index) => {
                  const isSelected = selectedFilters.priceRange.includes(range);
                  return (
                    <label
                      key={index}
                      className={`
                                            flex items-center gap-3 cursor-pointer p-3 rounded-xl
                                            transition-all duration-300 transform
                                            ${
                                              isSelected
                                                ? "bg-gradient-to-r from-green-100 to-yellow-100 border-3 border-yellow-400 scale-105 shadow-lg"
                                                : "bg-white border-2 border-gray-200 hover:border-green-300 hover:scale-102"
                                            }
                                        `}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleFilterChange(
                              e.target.checked,
                              range,
                              "priceRange"
                            )
                          }
                          className="w-5 h-5 rounded border-2 border-green-300 text-red-600 focus:ring-2 focus:ring-green-500 cursor-pointer"
                        />
                      </div>
                      <span
                        className={`font-semibold select-none ${
                          isSelected ? "text-red-700" : "text-gray-700"
                        }`}
                      >
                        {currency} {range}
                      </span>
                      {isSelected && (
                        <div className="ml-auto text-xl text-green-600 animate-pulse">
                          <i className="fas fa-tree"></i>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div className="px-6 pt-6 pb-8">
              <p className="font-black text-red-700 pb-3 text-lg flex items-center gap-2">
                <i className="fas fa-sort"></i> Sort By
              </p>
              <div className="space-y-2">
                {sortOptions.map((option, index) => {
                  const isSelected = selectedSort === option;
                  return (
                    <label
                      key={index}
                      className={`
                                            flex items-center gap-3 cursor-pointer p-3 rounded-xl
                                            transition-all duration-300 transform
                                            ${
                                              isSelected
                                                ? "bg-gradient-to-r from-yellow-100 to-red-100 border-3 border-red-400 scale-105 shadow-lg"
                                                : "bg-white border-2 border-gray-200 hover:border-yellow-300 hover:scale-102"
                                            }
                                        `}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="sortOption"
                          checked={isSelected}
                          onChange={() => handleSortChange(option)}
                          className="w-5 h-5 border-2 border-yellow-300 text-red-600 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                        />
                        {isSelected && (
                          <div
                            className="absolute -top-3 -right-3 text-xl text-yellow-400 animate-spin"
                            style={{ animationDuration: "3s" }}
                          >
                            <i className="fas fa-sparkles"></i>
                          </div>
                        )}
                      </div>
                      <span
                        className={`font-semibold select-none ${
                          isSelected ? "text-red-700" : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <div className="ml-auto text-xl text-red-600 animate-bounce">
                          <i className="fas fa-sleigh"></i>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="h-3 bg-gradient-to-r from-green-500 via-red-500 via-yellow-400 to-green-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
