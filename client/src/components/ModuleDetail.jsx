import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ModuleDetail() {
  const { moduleId } = useParams();

  const [currentModule, setCurrentModule] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function getCurrentModuledData() {
      setLoading(true);

      try {
        const result = await axios.post(
          `${apiUrl}/api/module/student/${moduleId}`,
          { studentId: userId },
          { headers: { token: token } },
        );

        setCurrentModule(result.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load module ❌");
      } finally {
        setLoading(false);
      }
    }

    if (moduleId) {
      getCurrentModuledData();
    }
  }, [moduleId, userId]);

  // ✅ Loader Screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ✅ Not Found
  if (!currentModule) {
    return (
      <div className="p-8 text-center text-gray-500">Module not found 📭</div>
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

      <h1 className="text-3xl font-bold mb-2">{currentModule.module_title}</h1>

      <p className="text-gray-600 mb-8">{currentModule.module_description}</p>

      <h2 className="text-lg font-semibold mb-4">Lessons</h2>

      {/* ✅ Empty Lessons */}
      {currentModule.lessons?.length === 0 && (
        <p className="text-gray-500">No lessons available 📚</p>
      )}

      <div className="space-y-3">
        {currentModule.lessons?.map((lesson) => (
          <Link
            key={lesson.lesson_id}
            to={`/student-dashboard/module/${moduleId}/lesson/${lesson.lesson_id}`}
            state={{ lesson }}
            className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-indigo-500 transition group"
          >
            <span className="font-medium text-gray-700 group-hover:text-indigo-600">
              {lesson.lesson_title}
            </span>

            {lesson.is_completed ? (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                ✅ Complete
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                ⏳ Incomplete
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
