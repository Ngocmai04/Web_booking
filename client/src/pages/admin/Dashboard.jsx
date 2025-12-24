import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, getToken, navigate } = useAppContext();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ========================
  // Fetch Admin Stats
  // ========================
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();

      const res = await axios.get("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to load stats");
      }

      setStats(res.data.stats);
    } catch (err) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";

      // Unauthorized / Forbidden
      if (status === 401 || status === 403) {
        toast.error("You are not authorized to access admin dashboard");
        navigate("/");
        return;
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [axios, getToken, navigate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ========================
  // Loading UI
  // ========================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600" />
      </div>
    );
  }

  // ========================
  // Error UI
  // ========================
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Failed to load dashboard
        </h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // ========================
  // Safe destructuring
  // ========================
  const {
    users = {},
    hotels = {},
    bookings = {},
    rooms = {},
  } = stats;

  // ========================
  // Stats Cards Config
  // ========================
  const statsCards = [
    {
      title: "Users",
      value: users.total || 0,
      icon: "fas fa-users",
      gradient: "from-blue-500 to-blue-600",
      details: [
        { label: "Regular", value: users.regularUsers || 0, icon: "fa-user" },
        { label: "Owners", value: users.hotelOwners || 0, icon: "fa-building" },
        { label: "Admins", value: users.admins || 0, icon: "fa-user-shield" },
      ],
    },
    {
      title: "Hotels",
      value: hotels.total || 0,
      icon: "fas fa-hotel",
      gradient: "from-green-500 to-green-600",
      details: [
        { label: "Approved", value: hotels.approved || 0, icon: "fa-check-circle" },
        { label: "Pending", value: hotels.pending || 0, icon: "fa-clock", highlight: true },
      ],
    },
    {
      title: "Bookings",
      value: bookings.total || 0,
      icon: "fas fa-calendar-check",
      gradient: "from-purple-500 to-purple-600",
      details: [
        { label: "Confirmed", value: bookings.confirmed || 0, icon: "fa-check" },
        { label: "Pending", value: bookings.pending || 0, icon: "fa-hourglass-half" },
        { label: "Cancelled", value: bookings.cancelled || 0, icon: "fa-times-circle" },
      ],
    },
    {
      title: "Rooms",
      value: rooms.total || 0,
      icon: "fas fa-door-open",
      gradient: "from-orange-500 to-orange-600",
      details: [
        { label: "Available", value: rooms.total || 0, icon: "fa-door-open" },
      ],
    },
  ];

  // ========================
  // Render
  // ========================
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <i className="fas fa-chart-line" />
          Admin Dashboard
        </h1>
        <p className="text-red-100 text-lg">
          System overview & management insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all relative overflow-hidden`}
          >
            <i className={`${card.icon} absolute top-2 right-2 text-7xl opacity-10`} />

            <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
            <p className="text-4xl font-bold mb-4">{card.value}</p>

            <div className="space-y-1 border-t border-white/20 pt-3 text-sm">
              {card.details.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span className="opacity-90">
                    <i className={`fas ${d.icon} mr-2`} />
                    {d.label}
                  </span>
                  <span className={`font-bold ${d.highlight ? "text-yellow-200 animate-pulse" : ""}`}>
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
