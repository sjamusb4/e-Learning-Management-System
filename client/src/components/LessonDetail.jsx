import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { useLocation } from "react-router-dom";
import Loader from "../utils/Loader";

export default function LessonDetail() {
  const location = useLocation();

  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    location.state?.lesson.is_completed,
  );

  // Fetch lesson
  useEffect(() => {
    async function getCurrentLessonData() {
      setLoading(true);

      try {
        const result = await axios.get(`${apiUrl}/api/lesson/${lessonId}`, {
          headers: { token: token },
        });

        setCurrentLesson(result.data);
        setIsCompleted(result.data.is_completed); //
      } catch (error) {
        console.error(error);
        toast.error("Failed to load lesson!");
      } finally {
        setLoading(false);
      }
    }

    if (lessonId) {
      getCurrentLessonData();
    }
  }, [lessonId]);

  const handleToggleComplete = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${apiUrl}/api/lesson-progress/`,
        { lessonId: currentLesson.lesson_id },
        { headers: { token: token } },
      );

      toast.success(
        isCompleted ? "Marked as incomplete!" : "Lesson completed!",
      );

      navigate(`/student-dashboard/module/${moduleId}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentLesson) {
    return <Loader />;
  }

  if (!currentLesson) {
    return (
      <div className="p-8 text-center text-gray-500">Lesson not found!</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {loading && <Loader />}
      <button
        onClick={() => navigate(`/student-dashboard/module/${moduleId}`)}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-6"
      >
        ← Back to Module Overview
      </button>

      <article className="bg-white p-8 rounded-xl border shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{currentLesson.title}</h1>

        <div className="text-gray-700 mb-8 whitespace-pre-line">
          {currentLesson.content}
        </div>

        <div className="border-t pt-6 flex justify-end">
          <button
            onClick={handleToggleComplete}
            disabled={location.state?.lesson.is_completed || loading}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition 
            ${
              location.state?.lesson.is_completed
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-500"
            }`}
          >
            {location.state?.lesson.is_completed
              ? "Already Completed"
              : "Mark as Complete & Exit"}
          </button>
        </div>
      </article>
    </div>
  );
}
