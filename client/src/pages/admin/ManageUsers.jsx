import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const { axios, getToken } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, user, hotelOwner, admin

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (userId) => {
    try {
      const { data } = await axios.put(
        `/api/admin/users/${userId}/toggle-active`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeRole = async (userId, newRole) => {
    try {
      const { data } = await axios.put(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        👥 Quản lý Người dùng
      </h1>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "user", "hotelOwner", "admin"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f === "all"
              ? "Tất cả"
              : f === "hotelOwner"
              ? "Hotel Owner"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-gray-600 font-medium">Avatar</th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Username
                </th>
                <th className="py-4 px-4 text-gray-600 font-medium">Email</th>
                <th className="py-4 px-4 text-gray-600 font-medium">Role</th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Trạng thái
                </th>
                <th className="py-4 px-4 text-gray-600 font-medium">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <img
                      src={user.image || "https://via.placeholder.com/40"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-4 px-4 font-medium">{user.username}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {user.email || "N/A"}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer
                                                ${
                                                  user.role === "admin"
                                                    ? "bg-red-100 text-red-700"
                                                    : user.role === "hotelOwner"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                    >
                      <option value="user">User</option>
                      <option value="hotelOwner">Hotel Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${
                                              user.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                    >
                      {user.isActive ? "✓ Hoạt động" : "✗ Đã khóa"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleActive(user._id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition
                                                ${
                                                  user.isActive
                                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                                }`}
                    >
                      {user.isActive ? "🔒 Khóa" : "🔓 Mở khóa"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    Không có người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Tổng: {filteredUsers.length} người dùng
      </p>
    </div>
  );
};

export default ManageUsers;
