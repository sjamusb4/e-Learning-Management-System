import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AssignTab({
  modules,
  students,
  setLoading,
  onAssignSuccess,
}) {
  const [studentId, setStudentId] = useState("");
  const [moduleId, setModuleId] = useState("");

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const handleAssign = async () => {
    if (!studentId || !moduleId) {
      return toast.error("Select Module & Student!");
    }
    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/api/enrollment/enroll`,
        { moduleId: Number(moduleId), studentId: Number(studentId) },
        { headers: { token } },
      );

      toast.success("Assigned successfully!");

      if (onAssignSuccess) {
        await onAssignSuccess();
      }

      // reset selections on completion success
      setStudentId("");
      setModuleId("");
    } catch (error) {
      // Fallback checks message strings from backend error responses directly
      const errorMsg = error.response?.data?.message || "Assignment failed!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto border border-gray-100">
      <h3 className="font-bold mb-4 text-gray-800 text-lg">Assign Module</h3>

      {/* Student Selector Row */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Students
        </label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full border border-gray-300 p-2.5 rounded bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Module Selector Row */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Modules
        </label>
        <select
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          className="w-full border border-gray-300 p-2.5 rounded bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Module</option>
          {modules.map((m) => (
            /* NOTE: Keeps your exact module naming properties intact while adjusting values safely */
            <option key={m.module_id || m.id} value={m.module_id || m.id}>
              {m.module_title || m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Action Button Trigger */}
      <button
        onClick={handleAssign}
        disabled={!studentId || !moduleId}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2.5 rounded font-medium transition-colors disabled:cursor-not-allowed"
      >
        Assign Module
      </button>
    </div>
  );
}
