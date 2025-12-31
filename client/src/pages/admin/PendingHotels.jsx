import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const PendingHotels = () => {
  const { axios, getToken } = useAppContext();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingHotels = useCallback(async () => {
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
  }, [axios, getToken]);

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
  }, [fetchPendingHotels]);

  // Beautiful Christmas SVG Icons with animations
  const ChristmasTreeIcon = ({ className = "w-10 h-10" }) => (
    <svg className={`inline-block ${className} animate-sway`} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2D5016', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#52A336', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M12 2L9 8h6l-3-6z" fill="url(#treeGradient)" stroke="#1a3d0f" strokeWidth="1.2"/>
      <path d="M8 8L5 14h14l-3-6H8z" fill="url(#treeGradient)" stroke="#1a3d0f" strokeWidth="1.2"/>
      <path d="M6 14L3 20h18l-3-6H6z" fill="url(#treeGradient)" stroke="#1a3d0f" strokeWidth="1.2"/>
      <rect x="10.5" y="20" width="3" height="2.5" fill="#6B4423" stroke="#4a2f18" strokeWidth="0.8"/>
      <circle cx="12" cy="5" r="1" fill="#FFD700" filter="url(#glow)" className="animate-twinkle"/>
      <circle cx="7" cy="11" r="0.9" fill="#FF0000" filter="url(#glow)" className="animate-twinkle-delayed"/>
      <circle cx="17" cy="11" r="0.9" fill="#FF0000" filter="url(#glow)" className="animate-twinkle"/>
      <circle cx="9" cy="17" r="0.9" fill="#FFD700" filter="url(#glow)" className="animate-twinkle-delayed"/>
      <circle cx="15" cy="17" r="0.9" fill="#FFD700" filter="url(#glow)" className="animate-twinkle"/>
    </svg>
  );

  const SantaIcon = ({ className = "w-20 h-20" }) => (
    <svg className={`inline-block ${className} animate-bounce-slow`} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="faceGradient">
          <stop offset="0%" style={{ stopColor: '#FFE0CC', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFD4B8', stopOpacity: 1 }} />
        </radialGradient>
        <linearGradient id="hatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#DC2626', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#991B1B', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="12" cy="11" r="5" fill="url(#faceGradient)" stroke="#D4A894" strokeWidth="0.5"/>
      <ellipse cx="12" cy="16" rx="7" ry="6" fill="url(#hatGradient)" stroke="#7F1D1D" strokeWidth="0.8"/>
      <rect x="9" y="2" width="6" height="5" rx="1.5" fill="url(#hatGradient)" stroke="#7F1D1D" strokeWidth="0.8"/>
      <rect x="8" y="6" width="8" height="2.5" rx="1.2" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5"/>
      <circle cx="10" cy="10" r="1" fill="#1F2937"/>
      <circle cx="14" cy="10" r="1" fill="#1F2937"/>
      <path d="M10 13Q12 15 14 13" stroke="#DC2626" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="12" cy="3.5" rx="1.5" ry="1.5" fill="#FFFFFF" className="animate-pulse"/>
    </svg>
  );

  const GiftBoxIcon = ({ className = "w-8 h-8" }) => (
    <svg className={`inline-block ${className} group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#DC2626', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#FCD34D', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="16" height="10" rx="1" fill="url(#boxGradient)" stroke="#991B1B" strokeWidth="1.5"/>
      <path d="M12 10v10" stroke="url(#ribbonGradient)" strokeWidth="2"/>
      <rect x="3" y="8" width="18" height="3" rx="1" fill="url(#ribbonGradient)" stroke="#D97706" strokeWidth="1.2"/>
      <path d="M12 3C10.5 3 9.5 4 9.5 5.5C9.5 6 10 7 11 8h2c1-1 1.5-2 1.5-2.5C14.5 4 13.5 3 12 3z" fill="url(#boxGradient)" stroke="#991B1B" strokeWidth="1"/>
      <circle cx="8" cy="14" r="0.8" fill="#FBBF24" className="animate-twinkle"/>
      <circle cx="16" cy="16" r="0.8" fill="#FBBF24" className="animate-twinkle-delayed"/>
    </svg>
  );

  const HotelIcon = ({ className = "w-6 h-6" }) => (
    <svg className={`inline-block ${className} group-hover:scale-125 transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const LocationIcon = ({ className = "w-5 h-5" }) => (
    <svg className={`inline-block ${className} group-hover:scale-110 transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const PhoneIcon = ({ className = "w-5 h-5" }) => (
    <svg className={`inline-block ${className} group-hover:rotate-12 transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const UserIcon = ({ className = "w-5 h-5" }) => (
    <svg className={`inline-block ${className} group-hover:scale-110 transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const EmailIcon = ({ className = "w-5 h-5" }) => (
    <svg className={`inline-block ${className} group-hover:scale-110 transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const CalendarIcon = ({ className = "w-5 h-5" }) => (
    <svg className={`inline-block ${className} group-hover:scale-110 transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const CheckIcon = ({ className = "w-6 h-6" }) => (
    <svg className={`inline-block ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );

  const XIcon = ({ className = "w-6 h-6" }) => (
    <svg className={`inline-block ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-200"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-green-600 absolute top-0"></div>
          <ChristmasTreeIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" />
        </div>
        <p className="mt-6 text-gray-700 font-bold text-lg flex items-center gap-2">
          <GiftBoxIcon />
          Loading Christmas magic...
          <GiftBoxIcon />
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 relative">
        <div className="absolute -top-4 -left-4 opacity-20">
          <ChristmasTreeIcon className="w-32 h-32" />
        </div>
        <div className="absolute -top-4 -right-4 opacity-20">
          <ChristmasTreeIcon className="w-32 h-32" />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 mb-3 flex items-center justify-center gap-4 relative">
          <ChristmasTreeIcon className="w-12 h-12" />
          Hotels Pending Approval
          <GiftBoxIcon className="w-12 h-12" />
        </h1>
        <p className="text-gray-700 leading-relaxed text-center text-lg font-medium">
          🎅 Review and approve new hotel registrations to spread the Christmas joy! 🎄
        </p>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-gradient-to-br from-red-50 via-white to-green-50 border-4 border-red-300 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 opacity-10">
            <ChristmasTreeIcon className="w-24 h-24" />
          </div>
          <div className="absolute bottom-4 right-4 opacity-10">
            <GiftBoxIcon className="w-24 h-24" />
          </div>
          <div className="mb-6 flex justify-center relative z-10">
            <SantaIcon className="w-32 h-32" />
          </div>
          <p className="text-gray-800 text-3xl font-black mb-3 relative z-10">
            🎄 All caught up! 🎄
          </p>
          <p className="text-gray-600 text-xl font-semibold relative z-10">
            No hotels pending approval at the moment!
          </p>
          <div className="mt-6 flex justify-center gap-4 relative z-10">
            <ChristmasTreeIcon className="w-10 h-10" />
            <GiftBoxIcon className="w-10 h-10" />
            <ChristmasTreeIcon className="w-10 h-10" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-gradient-to-br from-white to-red-50 border-4 border-green-300 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden relative group"
              >
                {/* Animated background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Corner decorations */}
                <div className="absolute top-3 right-3 z-10">
                  <GiftBoxIcon className="w-10 h-10" />
                </div>
                <div className="absolute bottom-3 left-3 opacity-30">
                  <ChristmasTreeIcon className="w-16 h-16" />
                </div>

                <div className="p-6 relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2 group mb-2">
                        <HotelIcon className="text-red-600" />
                        {hotel.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2 font-semibold group">
                        <LocationIcon className="text-green-600" />
                        {hotel.city}
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-300 to-orange-400 text-orange-900 border-3 border-yellow-500 rounded-full text-xs font-black shadow-lg flex items-center gap-2 animate-pulse">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
                      </svg>
                      Pending
                    </span>
                  </div>

                  {/* Info Card */}
                  <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-2xl p-5 mb-5 space-y-4 border-3 border-red-200 shadow-inner">
                    <div className="flex items-start gap-3 group">
                      <LocationIcon className="text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-wide mb-1">Address</p>
                        <p className="text-sm text-gray-800 font-bold">{hotel.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 group">
                      <PhoneIcon className="text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-wide mb-1">Contact</p>
                        <p className="text-sm text-gray-800 font-bold">{hotel.contact}</p>
                      </div>
                    </div>

                    <div className="border-t-3 border-red-300 pt-4 mt-4 space-y-3">
                      <div className="flex items-start gap-3 group">
                        <UserIcon className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-black uppercase tracking-wide mb-1">Owner</p>
                          <p className="text-sm text-gray-800 font-bold">
                            {hotel.owner?.username || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 group">
                        <EmailIcon className="text-purple-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-black uppercase tracking-wide mb-1">Email</p>
                          <p className="text-sm text-gray-800 font-bold break-all">
                            {hotel.owner?.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 group">
                        <CalendarIcon className="text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-black uppercase tracking-wide mb-1">Registered</p>
                          <p className="text-sm text-gray-800 font-bold">
                            {new Date(hotel.createdAt).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => approveHotel(hotel._id)}
                      className="flex-1 px-5 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-black text-base hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-green-700 group"
                    >
                      <CheckIcon className="group-hover:scale-125 transition-transform" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectHotel(hotel._id)}
                      className="flex-1 px-5 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-black text-base hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-red-700 group"
                    >
                      <XIcon className="group-hover:scale-125 transition-transform" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-10 bg-gradient-to-r from-red-100 via-white to-green-100 border-4 border-red-300 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-20">
              <ChristmasTreeIcon className="w-20 h-20" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <GiftBoxIcon className="w-14 h-14" />
                <div>
                  <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Total Pending</p>
                  <p className="text-2xl text-gray-700 font-black">Hotels Awaiting Review</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
                  {hotels.length}
                </span>
                <ChristmasTreeIcon className="w-14 h-14" />
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes twinkle-delayed {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-twinkle-delayed {
          animation: twinkle-delayed 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>

      {/* FontAwesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default PendingHotels;