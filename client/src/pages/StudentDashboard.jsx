import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function StudentDashboard() {
  const [moduleData, setModuleData] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const studentId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function getStudentDashboardData() {
      setLoading(true);

      try {
        const result = await axios.get(
          `${apiUrl}/api/module/student-dashboard/${studentId}`,
          { headers: { token: token } },
        );

        setModuleData(result.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    if (studentId) {
      getStudentDashboardData();
    }
  }, [studentId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>

      <p className="text-gray-600 mb-8">
        Select a module below to view lessons and track your training progress.
      </p>

      {!loading && moduleData.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No modules assigned</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {moduleData.map((mod) => {
          const totalLessons = mod.total_lessons;
          const finishedInThisModule = mod.completed_lessons;

          const progressPercentage =
            totalLessons > 0
              ? Math.round((finishedInThisModule / totalLessons) * 100)
              : 0;

          return (
            <div
              key={mod.module_id}
              className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {mod.module_title}
                </h2>

                <p className="text-gray-600 text-sm mb-6">
                  {mod.module_description}
                </p>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress</span>

                    <span className="text-sm font-bold text-indigo-600">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 h-2 rounded-full">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {finishedInThisModule} / {totalLessons} lessons
                  </p>
                </div>
              </div>

              <Link
                to={`/student-dashboard/module/${mod.module_id}`}
                className="bg-indigo-600 text-white text-center px-4 py-2 rounded-lg hover:bg-indigo-500"
              >
                {progressPercentage === 100
                  ? "Review Module"
                  : "Continue Learning"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
