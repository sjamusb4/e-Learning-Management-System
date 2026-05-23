import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockModules } from "../data/mockData";

export default function LessonDetail() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();

  // Find the nested lesson reference
  const currentModule = mockModules.find((m) => m.id === moduleId);
  const currentLesson = currentModule?.lessons.find((l) => l.id === lessonId);

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
    let list = JSON.parse(localStorage.getItem("completedLessons") || "[]");

    if (isCompleted) {
      list = list.filter((id) => id !== lessonId);
    } else {
      list.push(lessonId);
    }

    localStorage.setItem("completedLessons", JSON.stringify(list));
    setIsCompleted(!isCompleted);

    // Auto-redirect student back to module index screen after toggling complete state
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
