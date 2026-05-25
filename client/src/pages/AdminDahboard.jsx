import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import UsersTab from "../components/UserTab";
import ModulesTab from "../components/ModulesTab";
import Loader from "../utils/Loader";

export default function AdminDashboard() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Users
  useEffect(() => {
    async function getUsersData() {
      try {
        setLoading(true);
        const result = await axios.get(`${apiUrl}/api/user`, {
          headers: { token },
        });
        setUsers(result.data);
      } catch {
        toast.error("Failed to fetch users ❌");
      } finally {
        setLoading(false);
      }
    }
    getUsersData();
  }, []);

  // ✅ Fetch Modules
  useEffect(() => {
    async function getModulesData() {
      try {
        setLoading(true);
        const result = await axios.get(`${apiUrl}/api/module/all`, {
          headers: { token },
        });
        setModules(result.data);
      } catch {
        toast.error("Failed to fetch modules ❌");
      } finally {
        setLoading(false);
      }
    }
    getModulesData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {loading && <Loader />}

      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 text-white p-4 space-y-2">
        <div className="text-xl font-bold mb-6">Admin Panel</div>

        {["users", "modules"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left p-2 rounded ${
              activeTab === tab ? "bg-blue-600" : "text-gray-400"
            }`}
          >
            {tab === "users" ? "👥 Users" : "📚 Modules"}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "users" && (
          <UsersTab users={users} setUsers={setUsers} setLoading={setLoading} />
        )}

        {activeTab === "modules" && (
          <ModulesTab
            modules={modules}
            setModules={setModules}
            setLoading={setLoading}
          />
        )}
      </main>
    </div>
  );
}
