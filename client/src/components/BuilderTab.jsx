import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function BuilderTab({ modules, setModules, setLoading }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [openModules, setOpenModules] = useState({});

  const toggleModule = (id) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [modTitle, setModTitle] = useState("");
  const [modDesc, setModDesc] = useState("");

  const [selectedMod, setSelectedMod] = useState("");
  const [lesTitle, setLesTitle] = useState("");
  const [lesContent, setLesContent] = useState("");

  // Explicitly convert the select string ID to a number for strict matching
  const selectedModuleObj = modules.find(
    (m) => m.module_id === Number(selectedMod),
  );

  const serialNo = selectedModuleObj?.lessons?.at(-1)?.serial_number + 1 || 1;

  // Add Module
  const addModule = async () => {
    if (!modTitle || !modDesc) {
      return toast.error("Fill all fields!");
    }

    try {
      setLoading(true);
      const result = await axios.post(
        `${apiUrl}/api/module/create`,
        {
          title: modTitle,
          description: modDesc,
        },
        { headers: { token } },
      );

      // FIX 2: Ensure the newly pushed module has a defined 'lessons' array
      // and maps backend keys to match your frontend properties (module_title, description)
      const newModule = {
        module_id: result.data.module_id || result.data.id,
        module_title: result.data.title || result.data.module_title || modTitle,
        description: result.data.description || modDesc,
        lessons: [],
      };

      setModules((prev) => [...prev, newModule]);
      toast.success("Module created!");

      setModTitle("");
      setModDesc("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create module!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Add Lesson
  const addLesson = async () => {
    if (!selectedMod || !lesTitle || !lesContent) {
      return toast.error("Select module & enter title and content!");
    }

    try {
      setLoading(true);
      const result = await axios.post(
        `${apiUrl}/api/lesson/create`,
        {
          moduleId: Number(selectedMod),
          title: lesTitle,
          content: lesContent,
          serialNumber: serialNo,
        },
        { headers: { token } },
      );

      // Cleanly normalize the lesson object payload before merging it into state
      const newLesson = {
        lesson_id: result.data.lesson_id || result.data.id,
        lesson_title: result.data.title || result.data.lesson_title || lesTitle,
        content: result.data.content || lesContent,
        serial_number: serialNo,
      };

      setModules((prev) =>
        prev.map((m) =>
          m.module_id === Number(selectedMod)
            ? {
                ...m,
                lessons: [...(m.lessons || []), newLesson],
              }
            : m,
        ),
      );

      toast.success("Lesson added!");

      setSelectedMod("");
      setLesTitle("");
      setLesContent("");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add lesson!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module Box */}
        <div className="bg-white p-5 rounded shadow border border-gray-100">
          <h3 className="font-bold mb-3 text-gray-800">New Module</h3>

          <input
            value={modTitle}
            onChange={(e) => setModTitle(e.target.value)}
            placeholder="Module Title (e.g., Intro to SQL)"
            className="w-full border p-2.5 mb-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={modDesc}
            onChange={(e) => setModDesc(e.target.value)}
            placeholder="Module Description"
            className="w-full border p-2.5 mb-4 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={addModule}
            className="w-full bg-blue-600 hover:bg-blue-700 font-medium text-white p-2.5 rounded transition-colors"
          >
            + Create Module
          </button>
        </div>

        {/* Lesson Box */}
        <div className="bg-white p-5 rounded shadow border border-gray-100">
          <h3 className="font-bold mb-3 text-gray-800">New Lesson</h3>

          <select
            value={selectedMod}
            onChange={(e) => setSelectedMod(e.target.value)}
            className="w-full border p-2.5 mb-3 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Choose Module</option>
            {modules.map((m) => (
              <option key={m.module_id} value={m.module_id}>
                {m.module_title}
              </option>
            ))}
          </select>

          <input
            value={lesTitle}
            onChange={(e) => setLesTitle(e.target.value)}
            placeholder="Lesson Title"
            className="w-full border p-2.5 mb-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <textarea
            value={lesContent}
            onChange={(e) => setLesContent(e.target.value)}
            placeholder="Lesson Content details..."
            className="w-full border p-2.5 mb-4 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="2"
          />

          <button
            onClick={addLesson}
            className="w-full bg-green-600 hover:bg-green-700 font-medium text-white p-2.5 rounded transition-colors"
          >
            + Add Lesson
          </button>
        </div>
      </div>

      {/* All Modules Render Box */}
      <div className="bg-white p-5 rounded border shadow-sm border-gray-200">
        <h3 className="font-bold mb-4 text-gray-800">All Modules</h3>

        {modules.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">
            No modules built yet.
          </p>
        ) : (
          modules.map((m) => {
            const isOpen = openModules[m.module_id];
            const currentLessons = m.lessons || [];

            return (
              <div
                key={m.module_id}
                className="border border-gray-200 rounded mb-3 overflow-hidden"
              >
                <button
                  onClick={() => toggleModule(m.module_id)}
                  className="w-full p-3.5 flex justify-between items-center bg-gray-50 hover:bg-gray-100/80 transition-colors text-left"
                >
                  <span className="font-medium text-gray-800 flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {isOpen ? "▼" : "▶"}
                    </span>
                    {m.module_title}
                  </span>

                  <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {currentLessons.length}{" "}
                    {currentLessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-200 bg-white divide-y divide-gray-100">
                    {currentLessons.length === 0 ? (
                      <p className="p-4 text-gray-400 text-sm italic">
                        No lessons added to this module yet.
                      </p>
                    ) : (
                      currentLessons.map((l) => (
                        <div
                          key={l.lesson_id}
                          className="p-4 pl-8 hover:bg-gray-50/50 transition-colors"
                        >
                          {/* Aligned fallback naming safely to support both title styles */}
                          <div className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              #{l.serial_number}
                            </span>
                            {l.lesson_title || l.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                            {l.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
