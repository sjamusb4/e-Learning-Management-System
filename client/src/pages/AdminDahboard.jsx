import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("users");

  // ✅ Mock Users (matches your DB)
  const [users, setUsers] = useState([]);

  // get all users
  useEffect(() => {
    async function getUsersData() {
      try {
        const result = await axios.get(`${apiUrl}/api/user`, {
          headers: { token: token },
        });
        console.log(result.data);
        setUsers(result.data);
      } catch (error) {
        console.error("Error fetching Users data:", error);
      }
    }
    getUsersData();
  }, []);

  // ✅ Mock Modules (matches DB)
  const [modules, setModules] = useState();
  //getModulesData
  useEffect(() => {
    async function getModulesData() {
      try {
        const result = await axios.get(`${apiUrl}/api/module`, {
          headers: { token: token },
        });
        console.log(result.data);
        setModules(result.data);
        // Update your state here, e.g., setDashboardData(result.data);
      } catch (error) {
        console.error("Error fetching Modules data:", error);
      }
    }

    getModulesData();
  }, []);

  // ✅ Toggle module active/inactive
  const handelActivateModule = async (moduleId, isActive) => {
    try {
      const result = await axios.patch(
        `${apiUrl}/api/module/toggle/${moduleId}`,
        {},
        {
          headers: { token: token },
        },
      );
      console.log(result.data);
    } catch (error) {
      console.error("Error activating Modules :", error);
    }
  };

  // ✅ Delete user
  const deleteUser = async (id) => {
    try {
      const choice = confirm("Are you sure you want to delete User?");
      if (!choice) {
        return;
      }
      const result = await axios.delete(`${apiUrl}/api/user/${id}`, {
        headers: { token: token },
      });
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching Users data:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 text-white p-4 space-y-2">
        <div className="text-xl font-bold mb-6">Admin Panel</div>

        {["users", "modules"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left p-2 rounded capitalize ${
              activeTab === tab ? "bg-blue-600" : "text-gray-400"
            }`}
          >
            {tab === "users" ? "👥 Users" : "📚 Modules"}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* ✅ USERS TAB */}
        {activeTab === "users" && (
          <div className="bg-white rounded shadow overflow-hidden">
            <h2 className="p-4 font-bold text-lg border-b">User Management</h2>

            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} className="border-b">
                    <td className="p-3 font-medium">{u.username}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs bg-gray-200">
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => deleteUser(u.user_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ MODULES TAB */}
        {activeTab === "modules" && (
          <div className="bg-white rounded shadow overflow-hidden">
            <h2 className="p-4 font-bold text-lg border-b">
              Module Management
            </h2>

            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {modules.map((m) => (
                  <tr key={m.module_id} className="border-b">
                    <td className="p-3 font-medium">{m.module_title}</td>
                    <td className="p-3">{m.module_description}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          m.module_is_active
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {m.module_is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() =>
                          handelActivateModule(m.module_id, m.module_is_active)
                        }
                        className={`px-3 py-1 rounded text-sm ${
                          m.module_is_active
                            ? "bg-yellow-500 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {m.module_is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
