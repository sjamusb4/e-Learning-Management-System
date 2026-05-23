import { useParams, Link } from "react-router-dom";
import { mockModules } from "../data/mockData";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const [currentModule, setCurrentModule] = useState();

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const userId = localStorage.getItem("userId");
  //const currentModule = mockModules.find((m) => m.id === moduleId);

  useEffect(() => {
    async function getCurrentModuledData() {
      try {
        const result = await axios.post(
          `${apiUrl}/api/module/student/${moduleId}`,
          { studentId: userId },
          {
            headers: { token: token },
          },
        );
        console.log(result.data);
        setCurrentModule(result.data);
        // Update your state here, e.g., setDashboardData(result.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    if (moduleId) {
      getCurrentModuledData();
    }
  }, [userId]);

  if (!currentModule) {
    return (
      <div className="p-8 text-center text-red-500">Module not found.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/student-dashboard"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {currentModule.module_title}
      </h1>
      <p className="text-gray-600 mb-8">{currentModule.module_description}</p>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Lessons</h2>
      <div className="space-y-3">
        {currentModule.lessons.map((lesson) => {
          return (
            <Link
              key={lesson.lesson_id}
              to={`/student-dashboard/module/${moduleId}/lesson/${lesson.id}`}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-all group"
            >
              <span className="font-medium text-gray-700 group-hover:text-indigo-600">
                {lesson.lesson_title}
              </span>
              {lesson.is_completed ? (
                <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  Complete
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                  Incomplete
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
