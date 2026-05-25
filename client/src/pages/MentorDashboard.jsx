import axios from "axios";
import React, { useEffect, useState } from "react";

export default function MentorDashboard() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [modules, setModules] = useState([]);

  //getModulesData
  useEffect(() => {
    async function getModulesData() {
      try {
        const result = await axios.get(`${apiUrl}/api/module`, {
          headers: { token: token },
        });
        console.log(result.data);
        setModules(result.data);
        // Update your state here, e.g., setDashboardData(result.data);
      } catch (error) {
        console.error("Error fetching Modules data:", error);
      }
    }

    getModulesData();
  }, []);

  const [students, setStudents] = useState([]);

  console.log("students", students);

  useEffect(() => {
    const getAllStudentProgress = async () => {
      try {
        const result = await axios.get(`${apiUrl}/api/lesson-progress/all`, {
          headers: { token: token },
        });
        console.log(result.data);
        setStudents(result.data.progress);
      } catch (error) {
        console.error("Error fetching Modules data:", error);
      }
    };
    getAllStudentProgress();
  }, []);

  // ✅ Accordion state
  const [openModules, setOpenModules] = useState({});

  const toggleModule = (id) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Form states
  const [modTitle, setModTitle] = useState("");
  const [modDesc, setModDesc] = useState("");
  const [selectedMod, setSelectedMod] = useState("");
  const [lesTitle, setLesTitle] = useState("");
  const [lesContent, setLesContent] = useState("");
  const [activeTab, setActiveTab] = useState("build");
  const [selectStudentId, setSelectStudentId] = useState(null);
  const [selectModuleId, setSelectModuleId] = useState(null);

  const serialNo =
    modules[selectedMod - 1]?.lessons?.at(-1)?.serial_number + 1 || 1;

  // Add module
  const addModule = async () => {
    if (!modTitle || !modDesc) return;

    try {
      const result = await axios.post(
        `${apiUrl}/api/module/create`,
        {
          title: modTitle,
          description: modDesc,
        },
        {
          headers: { token: token },
        },
      );
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching Modules data:", error);
    }

    setModTitle("");
    setModDesc("");
  };

  // Add lesson
  const addLesson = async () => {
    if (!selectedMod || !lesTitle) return;

    try {
      const result = await axios.post(
        `${apiUrl}/api/lesson/create`,
        {
          moduleId: selectedMod,
          title: lesTitle,
          content: lesContent,
          serialNumber: serialNo,
        },
        {
          headers: { token: token },
        },
      );
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching Modules data:", error);
    }

    setLesTitle("");
    setLesContent("");
  };

  // Enroll Student
  const handelEnroll = async () => {
    try {
      const result = await axios.post(
        `${apiUrl}/api/enrollment/enroll`,
        {
          moduleId: selectModuleId,
          studentId: selectStudentId,
        },
        {
          headers: { token: token },
        },
      );
      console.log(result.data);
    } catch (error) {
      console.error("Error Enrolling:", error);
    }
  };
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 text-white p-4 space-y-2">
        <div className="text-xl font-bold mb-6">LMS Mentor</div>

        {["build", "assign", "progress"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left p-2 rounded capitalize ${
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

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* ✅ BUILD TAB */}
        {activeTab === "build" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Create Module */}
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
                  placeholder="Descrption"
                  className="w-full border p-2 mb-2 rounded"
                />
                <button
                  onClick={addModule}
                  className="w-full bg-blue-600 text-white p-2 rounded"
                >
                  + Create Module
                </button>
              </div>

              {/* Create Lesson */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-2">New Lesson</h3>

                <select
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
                  + Add
                </button>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white p-4 rounded border shadow-sm">
              <h3 className="font-bold mb-4">Curriculum (Click Module)</h3>

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
                        {m.lessons.length} lessons
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t">
                        {m.lessons.length === 0 ? (
                          <p className="p-3 text-gray-400 text-sm">
                            No lessons yet
                          </p>
                        ) : (
                          m.lessons.map((l, i) => (
                            <div key={i} className="p-3 pl-6 border-b">
                              <div className="font-medium">
                                {l.lesson_title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {l.content}
                              </div>
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
        )}

        {/* ✅ ASSIGN TAB */}
        {activeTab === "assign" && (
          <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
            <h3 className="font-bold mb-4">Assign Course</h3>

            <select
              className="w-full border p-2 mb-4 rounded"
              onChange={(e) => setSelectStudentId(e.target.value)}
            >
              <option>Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className="w-full border p-2 mb-4 rounded"
              onChange={(e) => setSelectModuleId(e.target.value)}
            >
              <option>Select Module</option>
              {modules.map((m) => (
                <option key={m.module_id} value={m.module_id}>
                  {m.module_title}
                </option>
              ))}
            </select>

            <button
              onClick={handelEnroll}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Assign
            </button>
          </div>
        )}

        {/* ✅ PROGRESS TAB */}
        {activeTab === "progress" && (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Completed</th>
                  <th className="p-3">Progress</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="p-3 font-medium">{s.name}</td>

                    <td className="p-3">
                      {s.completed}/{s.total}
                    </td>

                    <td className="p-3">
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div
                          className="bg-blue-600 h-2 rounded"
                          style={{
                            width:
                              s.total == 0
                                ? "0%"
                                : `${(s.completed / s.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
