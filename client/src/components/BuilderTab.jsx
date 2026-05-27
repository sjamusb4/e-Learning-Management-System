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

  const selectedModuleObj = modules.find((m) => m.module_id == selectedMod);

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

      setModules((prev) => [...prev, result.data]);

      toast.success("Module created!");

      setModTitle("");
      setModDesc("");
    } catch (error) {
      toast.error("Failed to create module!");
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
          moduleId: selectedMod,
          title: lesTitle,
          content: lesContent,
          serialNumber: serialNo,
        },
        { headers: { token } },
      );

      setModules((prev) =>
        prev.map((m) =>
          m.module_id == selectedMod
            ? {
                ...m,
                lessons: [...(m.lessons || []), result.data],
              }
            : m,
        ),
      );

      toast.success("Lesson added!");

      setLesTitle("");
      setLesContent("");
    } catch (error) {
      toast.error("Failed to add lesson!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Module */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">New Module</h3>

          <input
            value={modTitle}
            onChange={(e) => setModTitle(e.target.value)}
            placeholder="Title"
            className="w-full border p-2 mb-2 rounded"
          />

          <input
            value={modDesc}
            onChange={(e) => setModDesc(e.target.value)}
            placeholder="Description"
            className="w-full border p-2 mb-2 rounded"
          />

          <button
            onClick={addModule}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            + Create Module
          </button>
        </div>

        {/* Lesson */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">New Lesson</h3>

          <select
            value={selectedMod}
            onChange={(e) => setSelectedMod(e.target.value)}
            className="w-full border p-2 mb-2 rounded"
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
            className="w-full border p-2 mb-2 rounded"
          />

          <textarea
            value={lesContent}
            onChange={(e) => setLesContent(e.target.value)}
            placeholder="Content"
            className="w-full border p-2 mb-2 rounded"
            rows="2"
          />

          <button
            onClick={addLesson}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            + Add Lesson
          </button>
        </div>
      </div>

      {/* All Modules  */}
      <div className="bg-white p-4 rounded border shadow-sm">
        <h3 className="font-bold mb-4">All Modules</h3>

        {modules.map((m) => {
          const isOpen = openModules[m.module_id];

          return (
            <div key={m.module_id} className="border rounded mb-2">
              <button
                onClick={() => toggleModule(m.module_id)}
                className="w-full p-3 flex justify-between bg-gray-50 hover:bg-gray-100"
              >
                <span>
                  {isOpen ? "▼" : "▶"} {m.module_title}
                </span>

                <span className="text-xs">
                  {(m.lessons || []).length} lessons
                </span>
              </button>

              {isOpen && (
                <div className="border-t">
                  {(m.lessons || []).length === 0 ? (
                    <p className="p-3 text-gray-400 text-sm">No lessons yet</p>
                  ) : (
                    m.lessons.map((l) => (
                      <div key={l.lesson_id} className="p-3 pl-6 border-b">
                        <div className="font-medium">{l.lesson_title}</div>
                        <div className="text-xs text-gray-500">{l.content}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
