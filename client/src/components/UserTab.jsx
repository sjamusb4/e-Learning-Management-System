import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UsersTab({
  users = [],
  setUsers,
  setLoading,
  loading,
}) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // State handles
  const [modalOpen, setModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUserName, setTargetUserName] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); // Track active role filter

  // Open modal trigger
  const openDeleteModal = (id, name) => {
    setTargetUserId(id);
    setTargetUserName(name);
    setModalOpen(true);
  };

  // Perform deletion query
  const confirmDeleteUser = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setModalOpen(false);

      await axios.delete(`${apiUrl}/api/user/${targetUserId}`, {
        headers: { token },
      });

      setUsers((prev) =>
        prev.filter((u) => u.user_id !== targetUserId && u.id !== targetUserId),
      );
      toast.success("User deleted!");
    } catch {
      toast.error("Delete failed!");
    } finally {
      setLoading(false);
      setTargetUserId(null);
      setTargetUserName("");
    }
  };

  // Filter users list based on selection dropdown state
  const filteredUsers = users.filter((u) => {
    if (roleFilter === "All") return true;
    return u.role?.toLowerCase() === roleFilter.toLowerCase();
  });

  return (
    <div className="bg-white rounded shadow overflow-hidden relative">
      {/* Header bar containing Title and Filter Layout */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <h2 className="font-bold text-gray-800">User Management</h2>

        {/* Role Filtering Input Selector Dropdown Element */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Filter Role:
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 p-1.5 text-sm rounded bg-white font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="Student">Students</option>
            <option value="Mentor">Mentors</option>
            <option value="Admin">Admins</option>
          </select>
        </div>
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 w-16">Sr.No.</th>
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="p-8 text-center text-sm text-gray-400 italic"
              >
                No users found for the selected role criteria.
              </td>
            </tr>
          ) : (
            filteredUsers.map((u, i) => {
              const userId = u.user_id || u.id;

              return (
                <tr
                  key={userId}
                  className="border-b hover:bg-gray-50/50 transition-colors"
                >
                  {/* Dynamic Serial Counter calculates matching index lengths cleanly */}
                  <td className="p-3 text-gray-500 font-medium">{i + 1}</td>
                  <td className="p-3 font-medium text-gray-900">
                    {u.username || u.name}
                  </td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        u.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : u.role === "Mentor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        openDeleteModal(userId, u.username || u.name)
                      }
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* CONFIRMATION MODAL OVERLAY WITH BACKDROP BLURRING */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl border border-gray-100 transform scale-100 transition-all animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{targetUserName}"
              </span>
              ? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setTargetUserId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium shadow-sm transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
