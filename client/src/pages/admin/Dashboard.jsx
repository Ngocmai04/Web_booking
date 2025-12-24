import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  Users,
  Snowflake,
  TreePine,
  UserCircle,
  Building2,
  Calendar,
  Gift,
  DollarSign,
  Gem,
  BellRing,
} from "lucide-react";

const Dashboard = () => {
  const { axios, getToken, navigate } = useAppContext();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Thêm currency constant
  const currency = "$";

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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Snowflake className="w-8 h-8 text-red-600 animate-pulse" />
          </div>
        </div>
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
  // Render
  // ========================
  return (
    <div>
      {/* Header with Christmas theme */}
      <div className="mb-8 relative">
        <div className="flex items-center gap-3 mb-2">
          <UserCircle className="w-12 h-12 text-red-600 animate-bounce" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600">
            Admin Dashboard
          </h1>
          <TreePine className="w-12 h-12 text-green-600 animate-bounce delay-100" />
        </div>
        <p className="text-gray-600 ml-16">
          Manage your holiday bookings with festive cheer! ✨
        </p>
      </div>

      {/* Stats Cards with Christmas theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <div
          className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl 
                      hover:shadow-2xl hover:scale-105 hover:-rotate-1 transform transition-all duration-300 
                      cursor-pointer group relative overflow-hidden border-4 border-blue-300"
        >
          <div className="absolute top-2 right-2 opacity-10">
            <Users className="w-16 h-16" />
          </div>
          <div className="absolute -top-6 -left-6 text-8xl opacity-5">❄</div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold opacity-90">Total Users</h3>
              <Snowflake className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </div>
            <p className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">
              {stats.users.total || 0}
            </p>
            <div className="mt-4 pt-4 border-t border-white/30 text-sm space-y-1">
              <div className="flex justify-between items-center">
                <span className="opacity-80">Hotel Owners:</span>
                <span className="font-semibold bg-white/20 px-2 py-1 rounded-full">
                  {stats.users.hotelOwners || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Admins:</span>
                <span className="font-semibold bg-white/20 px-2 py-1 rounded-full">
                  {stats.users.admins || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Card */}
        <div
          className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl 
                      hover:shadow-2xl hover:scale-105 hover:rotate-1 transform transition-all duration-300 
                      cursor-pointer group relative overflow-hidden border-4 border-green-300"
        >
          <div className="absolute top-2 right-2 opacity-10">
            <Building2 className="w-16 h-16" />
          </div>
          <div className="absolute -bottom-6 -right-6 opacity-5">
            <TreePine className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold opacity-90">Total Hotels</h3>
              <Gift className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </div>
            <p className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">
              {stats.hotels.total || 0}
            </p>
            <div className="mt-4 pt-4 border-t border-white/30 text-sm space-y-1">
              <div className="flex justify-between items-center">
                <span className="opacity-80">Approved:</span>
                <span className="font-semibold bg-white/20 px-2 py-1 rounded-full">
                  {stats.hotels.approved || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Pending:</span>
                <span className="font-semibold bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full animate-pulse">
                  {stats.hotels.pending || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Card */}
        <div
          className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl 
                      hover:shadow-2xl hover:scale-105 hover:-rotate-1 transform transition-all duration-300 
                      cursor-pointer group relative overflow-hidden border-4 border-purple-300"
        >
          <div className="absolute top-2 right-2 opacity-10">
            <Calendar className="w-16 h-16" />
          </div>
          <div className="absolute -top-6 -right-6 text-8xl opacity-5">⭐</div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold opacity-90">Bookings</h3>
              <BellRing className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </div>
            <p className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">
              {stats.bookings.total || 0}
            </p>
            <div className="mt-4 pt-4 border-t border-white/30 text-sm space-y-1">
              <div className="flex justify-between items-center">
                <span className="opacity-80">Confirmed:</span>
                <span className="font-semibold bg-white/20 px-2 py-1 rounded-full">
                  {stats.bookings.confirmed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Cancelled:</span>
                <span className="font-semibold bg-white/20 px-2 py-1 rounded-full">
                  {stats.bookings.cancelled || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div
          className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl 
                      hover:shadow-2xl hover:scale-105 hover:rotate-1 transform transition-all duration-300 
                      cursor-pointer group relative overflow-hidden border-4 border-yellow-300"
        >
          <div className="absolute top-2 right-2 opacity-10">
            <DollarSign className="w-16 h-16" />
          </div>
          <div className="absolute -bottom-6 -left-6 text-8xl opacity-5">💎</div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold opacity-90">Revenue</h3>
              <Gem className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </div>
            <p className="text-4xl font-bold mt-2 group-hover:scale-110 transition-transform">
              {currency}
              {(stats.revenue?.total || 0).toLocaleString()}
            </p>
            <div className="mt-4 pt-4 border-t border-white/30 text-sm">
              <div className="flex justify-between items-center">
                <span className="opacity-80">Total Rooms:</span>
                <span className="font-semibold bg-white/20 px-2 py-1 rounded-full">
                  {stats.rooms?.total || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div
        className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-red-100 
                    hover:border-green-200 hover:shadow-2xl transition-all duration-300"
      >
        <div className="bg-gradient-to-r from-red-500 via-green-500 to-red-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-9 h-9 text-white" />
              <h3 className="text-2xl font-bold text-white">
                Monthly Revenue Report
              </h3>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-red-200">
                  <th className="py-4 px-4 text-gray-700 font-bold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Month/Year
                    </div>
                  </th>
                  <th className="py-4 px-4 text-gray-700 font-bold">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4" /> Bookings
                    </div>
                  </th>
                  <th className="py-4 px-4 text-gray-700 font-bold">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Revenue
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(stats.revenue?.monthly || []).map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 
                               transition-all duration-300 group cursor-pointer"
                  >
                    <td className="py-4 px-4 font-medium text-gray-800 group-hover:text-red-600 transition-colors">
                      {item._id.month}/{item._id.year}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm
                                     group-hover:bg-blue-200 group-hover:scale-105 inline-block transition-all"
                      >
                        {item.count}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="text-green-600 font-bold text-lg group-hover:text-green-700 group-hover:scale-105 
                                     inline-block transition-all"
                      >
                        {currency}
                        {item.revenue.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!stats.revenue?.monthly || stats.revenue.monthly.length === 0) && (
                  <tr>
                    <td colSpan="3" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-6xl opacity-50">🎁</span>
                        <p className="text-gray-500 text-lg">
                          No data available yet
                        </p>
                        <p className="text-gray-400 text-sm">
                          Start tracking your Christmas bookings!
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;