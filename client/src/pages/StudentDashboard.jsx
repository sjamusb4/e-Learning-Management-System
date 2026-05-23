import { Link } from "react-router-dom";
import { mockModules } from "../data/mockData";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [moduleData, setModuleData] = useState([]);

  const token = localStorage.getItem("token");
  const studentId = 1 || localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function getStudentDashboardData() {
      try {
        const result = await axios.get(
          `${apiUrl}/api/module/student-dashboard/${studentId}`,
          { headers: { token: token } },
        );
        console.log(result.data);
        setModuleData(result.data);
        // Update your state here, e.g., setDashboardData(result.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    if (studentId) {
      getStudentDashboardData();
    }
  }, [studentId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
      <p className="text-gray-600 mb-8">
        Select a module below to view lessons and track your training progress.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {moduleData.map((mod) => {
          // 1. Filter out how many lessons in THIS module are marked complete
          const totalLessons = mod.total_lessons;
          const finishedInThisModule = mod.completed_lessons;

          // 2. Calculate percentage (handle divide-by-zero safely)
          const progressPercentage =
            totalLessons > 0
              ? Math.round((finishedInThisModule / totalLessons) * 100)
              : 0;

          return (
            <div
              key={mod.module_id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {mod.module_title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                  {mod.module_description}
                </p>

                {/* Progress Bar Container */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {progressPercentage}%
                    </span>
                  </div>

                  {/* Outer Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    {/* Inner Animated Metric Indicator */}
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-400">
                      {finishedInThisModule} of {totalLessons} lessons completed
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={`/student-dashboard/module/${mod.module_id}`}
                className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-500 transition-colors w-full text-center"
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
