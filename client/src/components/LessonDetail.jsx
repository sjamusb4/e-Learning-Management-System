import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { mockModules } from "../data/mockData";
import axios from "axios";

export default function LessonDetail() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("token");

  const [currentLesson, setCurrentLesson] = useState([]);

  useEffect(() => {
    async function getCurrentLessonData() {
      try {
        const result = await axios.get(`${apiUrl}/api/lesson/${lessonId}`, {
          headers: { token: token },
        });
        console.log(result.data);
        setCurrentLesson(result.data);
        // Update your state here, e.g., setDashboardData(result.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    if (lessonId) {
      getCurrentLessonData();
    }
  }, [lessonId]);
  // Load baseline status from persistent localStorage arrays
  const getInitialCompleteStatus = () => {
    const list = JSON.parse(localStorage.getItem("completedLessons") || "[]");
    return list.includes(lessonId);
  };
  const [isCompleted, setIsCompleted] = useState(getInitialCompleteStatus);

  if (!currentLesson) {
    return (
      <div className="p-8 text-center text-red-500">Lesson not found.</div>
    );
  }

  const handleToggleComplete = () => {
    try {
      const result = axios.post(
        `${apiUrl}/api/lesson-progress/`,
        { lessonId: currentLesson.lesson_id },
        { headers: { token: token } },
      );
      console.log(result.data);
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
    navigate(`/student-dashboard/module/${moduleId}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/student-dashboard/module/${moduleId}`)}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-6 block"
      >
        ← Back to Module Overview
      </button>

      <article className="prose max-w-none bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          {currentLesson.title}
        </h1>
        <div className="text-gray-700 leading-relaxed text-lg mb-8 whitespace-pre-line">
          {currentLesson.content}
        </div>

        <div className="border-t border-gray-100 pt-6 flex justify-end">
          <button
            onClick={handleToggleComplete}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              isCompleted
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-green-600 text-white hover:bg-green-500"
            }`}
          >
            {isCompleted
              ? "Mark as Incomplete & Exit"
              : "Mark as Complete & Exit"}
          </button>
        </div>
      </article>
    </div>
  );
}
