import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BuilderTab from "../components/BuilderTab";
import AssignTab from "../components/AssignTab";
import ProgressTab from "../components/ProgressTab";

export default function MentorDashboard() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("build");

  // ✅ Fetch Modules
  useEffect(() => {
    async function getModulesData() {
      setLoading(true);
      try {
        const result = await axios.get(`${apiUrl}/api/module`, {
          headers: { token },
        });
        setModules(result.data);
      } catch (error) {
        toast.error("Failed to fetch modules ❌");
      } finally {
        setLoading(false);
      }
    }

    getModulesData();
  }, []);

  // ✅ Fetch Students Progress
  useEffect(() => {
    async function getStudents() {
      try {
        const result = await axios.get(`${apiUrl}/api/lesson-progress/all`, {
          headers: { token },
        });
        setStudents(result.data.progress);
      } catch (error) {
        toast.error("Failed to fetch progress ❌");
      }
    }

    getStudents();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 text-white p-4 space-y-2">
        <div className="text-xl font-bold mb-6">LMS Mentor</div>

        {["build", "assign", "progress"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left p-2 rounded ${
              activeTab === tab ? "bg-blue-600" : "text-gray-400"
            }`}
          >
            {tab === "build"
              ? "📦 Builder"
              : tab === "assign"
                ? "🎯 Assign"
                : "📊 Progress"}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "build" && (
          <BuilderTab
            modules={modules}
            setModules={setModules}
            setLoading={setLoading}
          />
        )}

        {activeTab === "assign" && (
          <AssignTab
            modules={modules}
            students={students}
            setLoading={setLoading}
          />
        )}

        {activeTab === "progress" && (
          <ProgressTab students={students} setLoading={setLoading} />
        )}
      </main>
    </div>
  );
}
``;
