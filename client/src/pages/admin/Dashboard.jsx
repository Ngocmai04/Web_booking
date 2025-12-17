import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, getToken, currency } = useAppContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-medium opacity-90">Users:</h3>
          <p className="text-3xl font-bold mt-2">{stats.users.total}</p>
          <div className="mt-3 text-sm opacity-80">
            <p>Hotel Owners: {stats.users.hotelOwners}</p>
            <p>Admins: {stats.users.admins}</p>
          </div>
        </div>

        {/* Hotels Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-medium opacity-90">Hotels:</h3>
          <p className="text-3xl font-bold mt-2">{stats.hotels.total}</p>
          <div className="mt-3 text-sm opacity-80">
            <p>Approved: {stats.hotels.approved}</p>
            <p className="text-yellow-200">Pending: {stats.hotels.pending}</p>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-medium opacity-90">Bookings:</h3>
          <p className="text-3xl font-bold mt-2">{stats.bookings.total}</p>
          <div className="mt-3 text-sm opacity-80">
            <p>Confirmed: {stats.bookings.confirmed}</p>
            <p>Cancelled: {stats.bookings.cancelled}</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-medium opacity-90">Revenue:</h3>
          <p className="text-3xl font-bold mt-2">
            {currency}
            {stats.revenue.total.toLocaleString()}
          </p>
          <div className="mt-3 text-sm opacity-80">
            <p>Rooms: {stats.rooms.total}</p>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart (Simple) */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Revenue
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-gray-600">Month/Year</th>
                <th className="py-3 px-4 text-gray-600">Number of Bookings</th>
                <th className="py-3 px-4 text-gray-600">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.revenue.monthly.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {item._id.month}/{item._id.year}
                  </td>
                  <td className="py-3 px-4">{item.count}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">
                    {currency}
                    {item.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
              {stats.revenue.monthly.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
