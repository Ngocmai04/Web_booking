import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import AddUserAdminForm from "./AddUserAdminForm";
import {
  Users,
  User,
  Shield,
  Building2,
  Star,
  X,
  Plus,
  Mail,
  Image as ImageIcon,
  List,
  TreePine,
  Snowflake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ManageUsers = () => {
  const { axios, getToken } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-12 h-12 text-blue-600 animate-bounce" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            User Management
          </h1>
          <span className="text-5xl animate-bounce delay-100">
            <Snowflake className="w-8 h-8 text-blue-600" />
          </span>
        </div>
        <p className="text-gray-600 ml-16">
          Manage your festive community members! ✨
        </p>
      </div>

      {/* Filter and Add Button */}
      <div className="mb-6 flex gap-4 flex-wrap justify-between items-center">
        <div className="flex gap-3 flex-wrap">
          {[
            { value: "all", label: "All Users", emoji: <TreePine /> },
            { value: "user", label: "Users", emoji: <User /> },
            {
              value: "hotelOwner",
              label: "Hotel Owners",
              emoji: <Building2 />,
            },
            { value: "admin", label: "Admins", emoji: <Star /> },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setFilter(f.value);
                setCurrentPage(1);
              }}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 
                       transform hover:scale-105 hover:shadow-lg flex items-center gap-2
                       border-2 ${
                         filter === f.value
                           ? "bg-gradient-to-r from-red-500 to-green-500 text-white border-yellow-300 shadow-xl scale-105"
                           : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50"
                       }`}
            >
              <span className="text-xl">{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>
        </div>

      {/* Users Table */}
      <div
        className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-blue-100
                    hover:border-purple-200 hover:shadow-2xl transition-all duration-300"
      >
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">
              <List className="w-8 h-8 text-white" />
            </span>
            <h3 className="text-2xl font-bold text-white">Users Directory</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-red-50 to-green-50">
              <tr className="border-b-2 border-red-200">
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Avatar
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Username
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-700 font-bold">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Role
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                             transition-all duration-300 group"
                >
                  <td className="py-4 px-4">
                    <div className="relative inline-block">
                      <img
                        src={user.image || "https://via.placeholder.com/40"}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-4 border-blue-200 
                                 group-hover:border-purple-400 group-hover:scale-110 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 text-xl group-hover:scale-125 transition-transform">
                        {index % 3 === 0 ? "🎄" : index % 3 === 1 ? "⭐" : "🎁"}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {user.username}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 group-hover:text-gray-800 transition-colors">
                    {user.email || "N/A"}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user._id, e.target.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 cursor-pointer
                               transition-all duration-300 hover:scale-105 hover:shadow-lg
                               ${
                                 user.role === "admin"
                                   ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300"
                                   : user.role === "hotelOwner"
                                   ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-300"
                                   : "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300"
                               }`}
                    >
                      <option value="user">👤 User</option>
                      <option value="hotelOwner">🏨 Hotel Owner</option>
                      <option value="admin">⭐ Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-7xl opacity-50">🎅</span>
                      <p className="text-gray-500 text-xl font-semibold">
                        No users found
                      </p>
                      <p className="text-gray-400">
                        Try adjusting your filters!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
        <div className="bg-white px-5 py-3 rounded-xl shadow-md border-2 border-blue-200">
          <p className="text-sm text-gray-600 font-medium">
            Showing{" "}
            <span className="text-blue-600 font-bold">{startIndex + 1}</span> to{" "}
            <span className="text-blue-600 font-bold">
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of{" "}
            <span className="text-purple-600 font-bold">
              {filteredUsers.length}
            </span>{" "}
            users
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform
                     hover:scale-105 hover:shadow-lg border-2 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300
                         transform hover:scale-110 border-2 ${
                           page === currentPage
                             ? "bg-gradient-to-r from-red-500 to-green-500 text-white border-yellow-300 shadow-xl scale-110"
                             : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
                         }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform
                     hover:scale-105 hover:shadow-lg border-2 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;